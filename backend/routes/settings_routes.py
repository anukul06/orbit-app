"""
ORBIT — Settings Routes
User settings: dark mode, notifications, preferences, account management.
"""

from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db

settings_bp = Blueprint("settings", __name__)


@settings_bp.route("/", methods=["GET"])
def get_settings():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    s = db.execute("SELECT * FROM User_Settings WHERE user_id = ?", (user_id,)).fetchone()
    profile = db.execute("SELECT * FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    user = db.execute("SELECT email FROM Users WHERE id = ?", (user_id,)).fetchone()
    db.close()

    return jsonify({
        "dark_mode": s["dark_mode"] if s else 1,
        "notifications_enabled": s["notifications_enabled"] if s else 1,
        "weekly_summary": s["weekly_summary"] if s else 0,
        "skill_level": profile["skill_level"] if profile else "",
        "hours_per_day": profile["hours_per_day"] if profile else 2,
        "email": user["email"] if user else "",
    }), 200


@settings_bp.route("/", methods=["PUT"])
def update_settings():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    db = get_db()

    existing = db.execute("SELECT id FROM User_Settings WHERE user_id = ?", (user_id,)).fetchone()
    if existing:
        db.execute("""UPDATE User_Settings SET dark_mode=?, notifications_enabled=?, weekly_summary=? WHERE user_id=?""",
                   (data.get("dark_mode", 1), data.get("notifications_enabled", 1), data.get("weekly_summary", 0), user_id))
    else:
        db.execute("""INSERT INTO User_Settings (user_id, dark_mode, notifications_enabled, weekly_summary) VALUES (?,?,?,?)""",
                   (user_id, data.get("dark_mode", 1), data.get("notifications_enabled", 1), data.get("weekly_summary", 0)))

    # Update learning preferences
    if "skill_level" in data or "hours_per_day" in data:
        db.execute("UPDATE User_Profile SET skill_level=?, hours_per_day=? WHERE user_id=?",
                   (data.get("skill_level", ""), data.get("hours_per_day", 2), user_id))

    db.commit()
    db.close()
    return jsonify({"message": "Settings saved"}), 200


@settings_bp.route("/password", methods=["PUT"])
def change_password():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    current = data.get("current_password", "")
    new_pw = data.get("new_password", "")

    if not current or not new_pw or len(new_pw) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    db = get_db()
    user = db.execute("SELECT * FROM Users WHERE id = ?", (user_id,)).fetchone()
    if not check_password_hash(user["password_hash"], current):
        db.close()
        return jsonify({"error": "Current password is incorrect"}), 401

    db.execute("UPDATE Users SET password_hash = ? WHERE id = ?", (generate_password_hash(new_pw), user_id))
    db.commit()
    db.close()
    return jsonify({"message": "Password changed"}), 200


@settings_bp.route("/delete-account", methods=["DELETE"])
def delete_account():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    for table in ["Tasks", "Roadmap", "Reflections", "User_Profile", "User_Settings", "Streams",
                   "Community_Comments", "Community_Posts", "Post_Likes", "Followers", "Messages"]:
        db.execute(f"DELETE FROM {table} WHERE user_id = ?", (user_id,))
    db.execute("DELETE FROM Users WHERE id = ?", (user_id,))
    db.commit()
    db.close()
    session.clear()
    return jsonify({"message": "Account deleted"}), 200
