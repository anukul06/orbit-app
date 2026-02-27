"""
ORBIT — Dashboard Routes
Dynamic dashboard data from database.
"""

from flask import Blueprint, jsonify, session
from database import get_db
import json

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
def get_dashboard():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    user = db.execute("SELECT * FROM Users WHERE id = ?", (user_id,)).fetchone()
    profile = db.execute("SELECT * FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    stream = db.execute("SELECT * FROM Streams WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()

    # Task stats
    total_tasks = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ?", (user_id,)).fetchone()["c"]
    done_tasks = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]

    # Roadmap progress
    total_weeks = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ?", (user_id,)).fetchone()["c"]
    completed_weeks = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ? AND status = 'completed'", (user_id,)).fetchone()["c"]

    # Recent activity
    recent_tasks = db.execute(
        "SELECT task_title, completed, created_at FROM Tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
        (user_id,)
    ).fetchall()

    db.close()

    tasks_pct = round((done_tasks / total_tasks * 100)) if total_tasks > 0 else 0
    roadmap_pct = round((completed_weeks / total_weeks * 100)) if total_weeks > 0 else 0
    streak = profile["streak"] if profile else 0
    clarity = profile["clarity_score"] if profile else 0

    # Compute clarity if not set
    if clarity == 0 and total_tasks > 0:
        clarity = min(100, tasks_pct + roadmap_pct + (streak * 5))

    return jsonify({
        "user": {
            "name": profile["name"] if profile else "User",
            "email": user["email"],
            "field": stream["selected_field"] if stream else "",
            "substream": stream["selected_stream"] if stream else "",
        },
        "clarity_score": clarity,
        "tasks_done": done_tasks,
        "tasks_total": total_tasks,
        "tasks_pct": tasks_pct,
        "weekly_goal": min(100, tasks_pct + 20),
        "streak": streak,
        "roadmap_progress": roadmap_pct,
        "recent_activity": [
            {"text": r["task_title"], "done": bool(r["completed"]), "time": r["created_at"]}
            for r in recent_tasks
        ],
    }), 200


@dashboard_bp.route("/stats", methods=["GET"])
def get_stats():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    total = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ?", (user_id,)).fetchone()["c"]
    done = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]
    profile = db.execute("SELECT * FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    roadmap_done = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ? AND status = 'completed'", (user_id,)).fetchone()["c"]
    roadmap_total = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ?", (user_id,)).fetchone()["c"]
    db.close()

    return jsonify({
        "tasks_done": done,
        "tasks_total": total,
        "streak": profile["streak"] if profile else 0,
        "roadmap_pct": round((roadmap_done / roadmap_total * 100)) if roadmap_total > 0 else 0,
    }), 200


@dashboard_bp.route("/insights", methods=["GET"])
def get_insights():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    stream = db.execute("SELECT * FROM Streams WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.close()

    field = stream["selected_field"] if stream else "your field"
    return jsonify({
        "insight": f"Based on your activity, you show strong interest in analytical domains. Consider exploring Data Science within {field} for best career alignment."
    }), 200
