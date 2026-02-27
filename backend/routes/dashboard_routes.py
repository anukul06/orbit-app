"""
ORBIT — Dashboard Routes
Serves dashboard data: clarity score, stats, recent activity, AI insights.
"""

from flask import Blueprint, jsonify

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
def get_dashboard():
    """Get dashboard overview data."""
    # TODO: Implement dashboard data aggregation
    return jsonify({"message": "Dashboard endpoint", "status": "not_implemented"}), 501


@dashboard_bp.route("/stats", methods=["GET"])
def get_stats():
    """Get user stats (clarity score, streak, completion)."""
    # TODO: Implement stats calculation
    return jsonify({"message": "Stats endpoint", "status": "not_implemented"}), 501


@dashboard_bp.route("/insights", methods=["GET"])
def get_insights():
    """Get AI-generated insights for the user."""
    # TODO: Implement AI insights
    return jsonify({"message": "Insights endpoint", "status": "not_implemented"}), 501
