"""
ORBIT — Auth Routes
Signup, login, logout, profile CRUD with session management.
"""

from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db, generate_default_roadmap, generate_default_tasks

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    if db.execute("SELECT id FROM Users WHERE email = ?", (email,)).fetchone():
        db.close()
        return jsonify({"error": "Email already registered"}), 409

    db.execute("INSERT INTO Users (email, password_hash) VALUES (?, ?)",
               (email, generate_password_hash(password)))
    db.commit()
    user = db.execute("SELECT id, email FROM Users WHERE email = ?", (email,)).fetchone()
    # Create empty profile
    db.execute("INSERT INTO User_Profile (user_id) VALUES (?)", (user["id"],))
    db.commit()
    db.close()

    session["user_id"] = user["id"]
    return jsonify({"message": "Account created", "user": {"id": user["id"], "email": user["email"]}}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    user = db.execute("SELECT * FROM Users WHERE email = ?", (email,)).fetchone()
    db.close()

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    session["user_id"] = user["id"]
    return jsonify({"message": "Login successful", "user": {"id": user["id"], "email": user["email"]}}), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


@auth_bp.route("/session", methods=["GET"])
def check_session():
    """Check if user is logged in."""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"authenticated": False}), 401
    db = get_db()
    user = db.execute("SELECT id, email FROM Users WHERE id = ?", (user_id,)).fetchone()
    db.close()
    if not user:
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True, "user": {"id": user["id"], "email": user["email"]}}), 200


@auth_bp.route("/profile", methods=["GET"])
def get_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    user = db.execute("SELECT * FROM Users WHERE id = ?", (user_id,)).fetchone()
    profile = db.execute("SELECT * FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    stream = db.execute("SELECT * FROM Streams WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = {
        "id": user["id"],
        "email": user["email"],
        "name": profile["name"] if profile else "",
        "age": profile["age"] if profile else "",
        "college": profile["college"] if profile else "",
        "year_of_study": profile["year_of_study"] if profile else "",
        "degree": profile["degree"] if profile else "",
        "skill_level": profile["skill_level"] if profile else "",
        "hours_per_day": profile["hours_per_day"] if profile else 2,
        "clarity_score": profile["clarity_score"] if profile else 0,
        "streak": profile["streak"] if profile else 0,
        "field": stream["selected_field"] if stream else (profile["field"] if profile else ""),
        "substream": stream["selected_stream"] if stream else (profile["substream"] if profile else ""),
    }
    return jsonify({"user": data}), 200


@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    db = get_db()

    # Upsert profile
    existing = db.execute("SELECT id FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    if existing:
        db.execute("""
            UPDATE User_Profile SET name=?, age=?, college=?, year_of_study=?,
            degree=?, field=?, substream=?, skill_level=?, hours_per_day=?
            WHERE user_id=?
        """, (data.get("name",""), data.get("age",""), data.get("college",""),
              data.get("year",""), data.get("degree",""), data.get("field",""),
              data.get("substream",""), data.get("skillLevel",""),
              data.get("hoursPerDay", 2), user_id))
    else:
        db.execute("""
            INSERT INTO User_Profile (user_id, name, age, college, year_of_study, degree, field, substream, skill_level, hours_per_day)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, data.get("name",""), data.get("age",""), data.get("college",""),
              data.get("year",""), data.get("degree",""), data.get("field",""),
              data.get("substream",""), data.get("skillLevel",""), data.get("hoursPerDay", 2)))

    # Upsert stream
    field = data.get("field", "")
    substream = data.get("substream", "")
    s = db.execute("SELECT id FROM Streams WHERE user_id = ?", (user_id,)).fetchone()
    if s:
        db.execute("UPDATE Streams SET selected_field=?, selected_stream=? WHERE user_id=?", (field, substream, user_id))
    else:
        db.execute("INSERT INTO Streams (user_id, selected_field, selected_stream) VALUES (?,?,?)", (user_id, field, substream))

    db.commit()
    db.close()

    # Generate roadmap and tasks for new profile
    generate_default_roadmap(user_id, field, substream)
    generate_default_tasks(user_id)

    return jsonify({"message": "Profile updated, roadmap and tasks generated"}), 200
