"""
ORBIT — Database Models
"""

from database import db
from datetime import datetime


class User(db.Model):
    """User account model."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    # Profile fields
    age = db.Column(db.Integer)
    college = db.Column(db.String(200))
    year_of_study = db.Column(db.String(20))
    degree = db.Column(db.String(50))
    field = db.Column(db.String(100))
    substream = db.Column(db.String(100))
    skill_level = db.Column(db.String(50))
    hours_per_day = db.Column(db.Integer, default=2)

    # Metrics
    clarity_score = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    tasks = db.relationship("Task", backref="user", lazy=True)
    roadmaps = db.relationship("Roadmap", backref="user", lazy=True)
    reflections = db.relationship("Reflection", backref="user", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "age": self.age,
            "college": self.college,
            "year_of_study": self.year_of_study,
            "degree": self.degree,
            "field": self.field,
            "substream": self.substream,
            "skill_level": self.skill_level,
            "hours_per_day": self.hours_per_day,
            "clarity_score": self.clarity_score,
            "streak": self.streak,
        }


class Task(db.Model):
    """Daily task model."""
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    text = db.Column(db.String(300), nullable=False)
    done = db.Column(db.Boolean, default=False)
    priority = db.Column(db.String(20), default="medium")  # low, medium, high
    deadline = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "done": self.done,
            "priority": self.priority,
            "deadline": self.deadline,
        }


class Roadmap(db.Model):
    """Learning roadmap model."""
    __tablename__ = "roadmaps"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    week = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    topics = db.Column(db.Text)  # JSON string of topics
    project = db.Column(db.String(300))
    status = db.Column(db.String(20), default="upcoming")  # upcoming, in-progress, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "week": self.week,
            "title": self.title,
            "topics": json.loads(self.topics) if self.topics else [],
            "project": self.project,
            "status": self.status,
        }


class Reflection(db.Model):
    """Weekly reflection model."""
    __tablename__ = "reflections"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
        }
