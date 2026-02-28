"""
ORBIT — Dashboard Routes
Dynamic dashboard data from database.
"""

from flask import Blueprint, jsonify, session
from database import get_db, ROADMAP_TEMPLATES
import json
import random

dashboard_bp = Blueprint("dashboard", __name__)

# Stream-specific skill sets
STREAM_SKILLS = {
    "Data Science": ["Python", "Pandas/NumPy", "Statistics", "Data Visualization", "SQL"],
    "Artificial Intelligence": ["Python", "Linear Algebra", "Neural Networks", "TensorFlow", "Research"],
    "Machine Learning": ["Python", "Scikit-learn", "Math", "Model Tuning", "Deployment"],
    "Web Development": ["HTML/CSS", "JavaScript", "React", "Node.js", "Database"],
    "Cybersecurity": ["Networking", "Linux", "Ethical Hacking", "Cryptography", "Forensics"],
    "Structural Engineering": ["Mechanics", "Analysis", "Concrete Design", "Steel Design", "Software"],
    "Cardiology": ["Anatomy", "ECG", "Pathology", "Diagnostics", "Treatment"],
    "Investment Banking": ["Accounting", "Valuation", "Modeling", "M&A", "Presentations"],
    "Behavioral Economics": ["Micro Theory", "Biases", "Research Methods", "Policy", "Statistics"],
    "Clinical Psychology": ["Assessment", "CBT", "Abnormal Psych", "Ethics", "Research"],
}


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
    total_days = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ?", (user_id,)).fetchone()["c"]
    completed_days = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]

    # Recent activity
    recent_tasks = db.execute(
        "SELECT task_title, completed, created_at FROM Tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
        (user_id,)
    ).fetchall()

    db.close()

    tasks_pct = round((done_tasks / total_tasks * 100)) if total_tasks > 0 else 0
    roadmap_pct = round((completed_days / total_days * 100)) if total_days > 0 else 0
    streak = profile["streak"] if profile else 0

    # Dynamic clarity score
    clarity = min(100, round((tasks_pct * 0.4) + (roadmap_pct * 0.4) + (streak * 4)))

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
    roadmap_done = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]
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
    profile = db.execute("SELECT * FROM User_Profile WHERE user_id = ?", (user_id,)).fetchone()

    # Task stats
    total_tasks = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ?", (user_id,)).fetchone()["c"]
    done_tasks = db.execute("SELECT COUNT(*) as c FROM Tasks WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]

    # Roadmap stats
    total_days = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ?", (user_id,)).fetchone()["c"]
    completed_days = db.execute("SELECT COUNT(*) as c FROM Roadmap WHERE user_id = ? AND completed = 1", (user_id,)).fetchone()["c"]

    db.close()

    substream = stream["selected_stream"] if stream else ""
    field = stream["selected_field"] if stream else "your field"
    tasks_pct = round((done_tasks / total_tasks * 100)) if total_tasks > 0 else 0
    roadmap_pct = round((completed_days / total_days * 100)) if total_days > 0 else 0
    streak = profile["streak"] if profile else 0

    # Dynamic clarity
    clarity = min(100, round((tasks_pct * 0.4) + (roadmap_pct * 0.4) + (streak * 4)))

    # Simulate weekly engagement (seeded by user_id for consistency)
    random.seed(user_id * 7)
    base = max(10, tasks_pct)
    weekly_data = [
        min(100, max(5, base + random.randint(-15, 25))) for _ in range(7)
    ]
    avg_engagement = round(sum(weekly_data) / 7)
    best_day_idx = weekly_data.index(max(weekly_data))
    best_day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][best_day_idx]

    # Trend (simulate last week comparison)
    random.seed(user_id * 3)
    last_week_avg = max(5, avg_engagement + random.randint(-18, -2))
    trend = avg_engagement - last_week_avg
    trend_label = f"▲ +{trend}% vs last week" if trend >= 0 else f"▼ {trend}% vs last week"

    # Stream-based skills with progress
    skill_names = STREAM_SKILLS.get(substream, ["Fundamentals", "Practice", "Application", "Analysis", "Projects"])
    random.seed(user_id * 13)
    skills = []
    for i, name in enumerate(skill_names):
        # First skills higher, simulating natural learning order
        base_progress = max(5, roadmap_pct - (i * 10) + random.randint(-5, 10))
        skills.append({"name": name, "progress": min(100, max(5, base_progress))})

    # Performance pattern
    if avg_engagement > 60:
        pattern = "Strong and consistent"
        pattern_detail = "Your engagement is above average across the week. Great momentum!"
    elif weekly_data[0] > weekly_data[3]:
        pattern = "Strong start, mid-week dip"
        pattern_detail = "You tend to start strong but lose momentum mid-week. Try scheduling harder tasks early."
    elif weekly_data[5] > weekly_data[1]:
        pattern = "Weekend spike"
        pattern_detail = "You're most active on weekends. Consider doing lighter review tasks on weekdays."
    else:
        pattern = "Building momentum"
        pattern_detail = "Your engagement increases through the week. You're warming up — consistency is key."

    # AI insight
    if tasks_pct > 70:
        insight = f"Excellent progress! You've completed {tasks_pct}% of tasks in {substream or field}. Consider increasing difficulty or exploring adjacent topics to keep growing."
    elif tasks_pct > 40:
        insight = f"Good pace in {substream or field}. You're at {tasks_pct}% task completion. Focus on your roadmap milestones to bridge theory and practice."
    elif tasks_pct > 0:
        insight = f"You're getting started in {substream or field}. Aim to complete at least 2-3 tasks daily. Consistency beats intensity."
    else:
        insight = f"Welcome to {substream or field}! Start with your Week 1 roadmap items. Small daily wins compound into mastery."

    return jsonify({
        "clarity_score": clarity,
        "tasks_pct": tasks_pct,
        "roadmap_pct": roadmap_pct,
        "streak": streak,
        "substream": substream,
        "field": field,
        "weekly_data": weekly_data,
        "avg_engagement": avg_engagement,
        "best_day": best_day,
        "trend": trend,
        "trend_label": trend_label,
        "skills": skills,
        "pattern": pattern,
        "pattern_detail": pattern_detail,
        "insight": insight,
    }), 200
