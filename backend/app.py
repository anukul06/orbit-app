"""
ORBIT — Adaptive Career Operating System
Flask Application Entry Point
"""

from flask import Flask
from flask_cors import CORS
from config import Config
from database import init_db

# Import blueprints
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.roadmap_routes import roadmap_bp
from routes.task_routes import task_bp
from routes.chat_routes import chat_bp
from routes.settings_routes import settings_bp
from routes.community_routes import community_bp


def create_app():
    """Application factory pattern."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend
    CORS(app, origins=["http://localhost:5173"])

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(roadmap_bp, url_prefix="/api/roadmap")
    app.register_blueprint(task_bp, url_prefix="/api/tasks")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")
    app.register_blueprint(community_bp, url_prefix="/api/community")

    # Initialize database on startup
    init_db()

    @app.route("/")
    def index():
        return {"status": "ok", "message": "ORBIT API is running"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
