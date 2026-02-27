"""
ORBIT — Roadmap Routes
4-week roadmap CRUD from database.
"""

from flask import Blueprint, jsonify, session
from database import get_db
import json

roadmap_bp = Blueprint("roadmap", __name__)


@roadmap_bp.route("/", methods=["GET"])
def get_roadmap():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    rows = db.execute("SELECT * FROM Roadmap WHERE user_id = ? ORDER BY week ASC", (user_id,)).fetchall()
    stream = db.execute("SELECT * FROM Streams WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.close()

    roadmap = []
    for r in rows:
        roadmap.append({
            "id": r["id"],
            "week": r["week"],
            "title": r["title"],
            "topics": json.loads(r["topics"]) if r["topics"] else [],
            "project": r["project"],
            "status": r["status"],
        })

    completed = sum(1 for r in roadmap if r["status"] == "completed")
    total = len(roadmap)

    return jsonify({
        "roadmap": roadmap,
        "field": stream["selected_field"] if stream else "",
        "substream": stream["selected_stream"] if stream else "",
        "progress": round((completed / total * 100)) if total > 0 else 0,
    }), 200


@roadmap_bp.route("/progress", methods=["GET"])
def get_progress():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    total = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ?", (user_id,)).fetchone()["c"]
    done = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ? AND status = 'completed'", (user_id,)).fetchone()["c"]
    db.close()

    return jsonify({"progress": round((done / total * 100)) if total > 0 else 0}), 200
