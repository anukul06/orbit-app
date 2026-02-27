"""
ORBIT — Roadmap Routes
Manages learning roadmaps: weekly plans, milestones, progress tracking.
"""

from flask import Blueprint, jsonify

roadmap_bp = Blueprint("roadmap", __name__)


@roadmap_bp.route("/", methods=["GET"])
def get_roadmap():
    """Get the user's full roadmap."""
    # TODO: Implement roadmap retrieval
    return jsonify({"message": "Roadmap endpoint", "status": "not_implemented"}), 501


@roadmap_bp.route("/generate", methods=["POST"])
def generate_roadmap():
    """Generate a personalized roadmap based on user profile."""
    # TODO: Implement roadmap generation via AI service
    return jsonify({"message": "Generate roadmap endpoint", "status": "not_implemented"}), 501


@roadmap_bp.route("/progress", methods=["GET"])
def get_progress():
    """Get overall roadmap progress."""
    # TODO: Implement progress calculation
    return jsonify({"message": "Progress endpoint", "status": "not_implemented"}), 501
