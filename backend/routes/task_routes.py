"""
ORBIT — Task Routes
Task CRUD with completion toggle and streak tracking.
"""

from flask import Blueprint, request, jsonify, session
from database import get_db

task_bp = Blueprint("tasks", __name__)


@task_bp.route("/", methods=["GET"])
def get_tasks():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    rows = db.execute(
        "SELECT * FROM Tasks WHERE user_id = ? ORDER BY completed ASC, created_at DESC",
        (user_id,)
    ).fetchall()
    profile = db.execute("SELECT streak FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    db.close()

    tasks = [{
        "id": r["id"],
        "text": r["task_title"],
        "done": bool(r["completed"]),
        "priority": r["priority"],
        "deadline": r["deadline"],
    } for r in rows]

    return jsonify({
        "tasks": tasks,
        "streak": profile["streak"] if profile else 0,
    }), 200


@task_bp.route("/", methods=["POST"])
def create_task():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Task title is required"}), 400

    db = get_db()
    db.execute(
        "INSERT INTO Tasks (user_id, task_title, priority, deadline) VALUES (?, ?, ?, ?)",
        (user_id, title, data.get("priority", "medium"), data.get("deadline", ""))
    )
    db.commit()
    task = db.execute("SELECT * FROM Tasks WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.close()

    return jsonify({"task": {"id": task["id"], "text": task["task_title"], "done": False, "priority": task["priority"], "deadline": task["deadline"]}}), 201


@task_bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    db = get_db()
    task = db.execute("SELECT * FROM Tasks WHERE id = ? AND user_id = ?", (task_id, user_id)).fetchone()
    if not task:
        db.close()
        return jsonify({"error": "Task not found"}), 404

    # Toggle completion
    if "done" in data:
        new_status = 1 if data["done"] else 0
        db.execute("UPDATE Tasks SET completed = ? WHERE id = ?", (new_status, task_id))

        # Update streak
        total = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ?", (user_id,)).fetchone()["c"]
        done = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]
        if done > 0:
            streak = min(30, done)  # Simple streak calc
            db.execute("UPDATE User_Profile SET streak = ? WHERE user_id = ?", (streak, user_id))

            # Update clarity score
            clarity = min(100, round((done / total * 100) * 0.7 + streak * 1.5))
            db.execute("UPDATE User_Profile SET clarity_score = ? WHERE user_id = ?", (clarity, user_id))

    db.commit()
    db.close()

    return jsonify({"message": "Task updated"}), 200


@task_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    db.execute("DELETE FROM Tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    db.commit()
    db.close()

    return jsonify({"message": "Task deleted"}), 200


@task_bp.route("/streak", methods=["GET"])
def get_streak():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    profile = db.execute("SELECT streak FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    db.close()

    return jsonify({"streak": profile["streak"] if profile else 0}), 200
