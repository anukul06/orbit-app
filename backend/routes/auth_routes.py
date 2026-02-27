"""
ORBIT — Auth Routes
Handles signup, login, logout, and profile management.
Uses raw sqlite3 and Flask session for auth.
"""

from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user."""
    data = request.get_json()
    email = (data or {}).get("email", "").strip()
    password = (data or {}).get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = get_db()
    # Check if user already exists
    existing = db.execute("SELECT id FROM Users WHERE email = ?", (email,)).fetchone()
    if existing:
        db.close()
        return jsonify({"error": "Email already registered"}), 409

    # Create user
    password_hash = generate_password_hash(password)
    db.execute("INSERT INTO Users (email, password_hash) VALUES (?, ?)", (email, password_hash))
    db.commit()

    user = db.execute("SELECT id, email FROM Users WHERE email = ?", (email,)).fetchone()
    db.close()

    session["user_id"] = user["id"]
    return jsonify({"message": "Account created", "user": {"id": user["id"], "email": user["email"]}}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Log in an existing user."""
    data = request.get_json()
    email = (data or {}).get("email", "").strip()
    password = (data or {}).get("password", "").strip()

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
    """Log out the current user."""
    session.clear()
    return jsonify({"message": "Logged out"}), 200


@auth_bp.route("/profile", methods=["GET"])
def get_profile():
    """Get current user profile."""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    user = db.execute("SELECT * FROM Users WHERE id = ?", (user_id,)).fetchone()
    stream = db.execute("SELECT * FROM Streams WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"] if "name" in user.keys() else "",
        "age": user["age"] if "age" in user.keys() else "",
        "college": user["college"] if "college" in user.keys() else "",
        "year_of_study": user["year_of_study"] if "year_of_study" in user.keys() else "",
        "degree": user["degree"] if "degree" in user.keys() else "",
        "skill_level": user["skill_level"] if "skill_level" in user.keys() else "",
        "hours_per_day": user["hours_per_day"] if "hours_per_day" in user.keys() else 2,
        "field": stream["selected_field"] if stream else "",
        "substream": stream["selected_stream"] if stream else "",
    }
    return jsonify({"user": profile}), 200


@auth_bp.route("/profile", methods=["PUT"])
def update_profile():
    """Update user profile (complete-profile flow)."""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    db = get_db()

    # Update user fields
    db.execute("""
        UPDATE Users SET
            name = ?, age = ?, college = ?, year_of_study = ?,
            degree = ?, skill_level = ?, hours_per_day = ?
        WHERE id = ?
    """, (
        data.get("name", ""), data.get("age", ""), data.get("college", ""),
        data.get("year", ""), data.get("degree", ""),
        data.get("skillLevel", ""), data.get("hoursPerDay", 2), user_id
    ))

    # Upsert stream selection
    field = data.get("field", "")
    substream = data.get("substream", "")
    existing = db.execute("SELECT id FROM Streams WHERE user_id = ?", (user_id,)).fetchone()
    if existing:
        db.execute("UPDATE Streams SET selected_field = ?, selected_stream = ? WHERE user_id = ?",
                   (field, substream, user_id))
    else:
        db.execute("INSERT INTO Streams (user_id, selected_field, selected_stream) VALUES (?, ?, ?)",
                   (user_id, field, substream))

    db.commit()
    db.close()

    return jsonify({"message": "Profile updated"}), 200
