"""
ORBIT — Roadmap Routes
Returns profile-aware roadmap with Week → Day daily breakdown.
"""

from flask import Blueprint, request, jsonify, session
import json
from database import get_db

roadmap_bp = Blueprint("roadmap", __name__)


@roadmap_bp.route("/", methods=["GET"])
def get_roadmap():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    profile = db.execute("SELECT * FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()
    rows = db.execute("SELECT * FROM Roadmap WHERE user_id = ? ORDER BY week, day", (user_id,)).fetchall()
    db.close()

    # Group by week
    weeks = {}
    for r in rows:
        w = r["week"]
        if w not in weeks:
            meta = json.loads(r["topics"]) if r["topics"] else {}
            weeks[w] = {
                "week": w,
                "title": meta.get("week_title", f"Week {w}"),
                "days": [],
                "project": "",
                "status": "upcoming",
            }
        weeks[w]["days"].append({
            "id": r["id"],
            "day": r["day"],
            "title": r["title"],
            "completed": bool(r["completed"]),
            "status": r["status"],
        })
        if r["project"]:
            weeks[w]["project"] = r["project"]

    # Calculate week statuses
    for w in weeks.values():
        completed_count = sum(1 for d in w["days"] if d["completed"])
        total = len(w["days"])
        if completed_count == total and total > 0:
            w["status"] = "completed"
        elif completed_count > 0:
            w["status"] = "in-progress"
        else:
            w["status"] = "upcoming"

    # Overall progress
    all_days = [d for w in weeks.values() for d in w["days"]]
    total = len(all_days)
    done = sum(1 for d in all_days if d["completed"])
    progress = round(done / total * 100) if total > 0 else 0

    return jsonify({
        "roadmap": list(weeks.values()),
        "field": profile["field"] if profile else "",
        "substream": profile["substream"] if profile else "",
        "progress": progress,
    }), 200


@roadmap_bp.route("/toggle/<int:item_id>", methods=["POST"])
def toggle_day(item_id):
    """Toggle a day's completion status."""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    item = db.execute("SELECT * FROM Roadmap WHERE id = ? AND user_id = ?", (item_id, user_id)).fetchone()
    if not item:
        db.close()
        return jsonify({"error": "Not found"}), 404

    new_status = 0 if item["completed"] else 1
    new_label = "completed" if new_status else "upcoming"
    db.execute("UPDATE Roadmap SET completed = ?, status = ? WHERE id = ?", (new_status, new_label, item_id))
    db.commit()
    db.close()

    return jsonify({"completed": bool(new_status)}), 200


@roadmap_bp.route("/progress", methods=["GET"])
def get_progress():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    total = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ?", (user_id,)).fetchone()["c"]
    done = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]
    db.close()

    return jsonify({"total": total, "done": done, "progress": round(done / total * 100) if total > 0 else 0}), 200
