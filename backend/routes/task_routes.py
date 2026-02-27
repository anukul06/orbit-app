"""
ORBIT — Task Routes
Manages daily tasks: CRUD, completion tracking, streaks.
"""

from flask import Blueprint, jsonify

task_bp = Blueprint("tasks", __name__)


@task_bp.route("/", methods=["GET"])
def get_tasks():
    """Get all tasks for the current user."""
    # TODO: Implement task retrieval
    return jsonify({"message": "Get tasks endpoint", "status": "not_implemented"}), 501


@task_bp.route("/", methods=["POST"])
def create_task():
    """Create a new task."""
    # TODO: Implement task creation
    return jsonify({"message": "Create task endpoint", "status": "not_implemented"}), 501


@task_bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    """Update a task (toggle done, edit text)."""
    # TODO: Implement task update
    return jsonify({"message": f"Update task {task_id} endpoint", "status": "not_implemented"}), 501


@task_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    """Delete a task."""
    # TODO: Implement task deletion
    return jsonify({"message": f"Delete task {task_id} endpoint", "status": "not_implemented"}), 501


@task_bp.route("/streak", methods=["GET"])
def get_streak():
    """Get the user's current streak."""
    # TODO: Implement streak calculation
    return jsonify({"message": "Streak endpoint", "status": "not_implemented"}), 501
