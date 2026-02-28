"""
ORBIT — Adaptive Career Operating System
Flask Application Entry Point
Serves React frontend static files in production.
"""

import os
from flask import Flask, send_from_directory
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
    # Check if we have a built frontend to serve
    static_dir = os.path.join(os.path.dirname(__file__), "static")
    has_static = os.path.isdir(static_dir) and os.path.exists(os.path.join(static_dir, "index.html"))

    if has_static:
        app = Flask(__name__, static_folder="static", static_url_path="")
    else:
        app = Flask(__name__)

    app.config.from_object(Config)

    # CORS — allow localhost in dev + any Render domain in prod
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    render_url = os.getenv("RENDER_EXTERNAL_URL")
    if render_url:
        allowed_origins.append(render_url)
    CORS(app, origins=allowed_origins, supports_credentials=True)

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

    # API health check
    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "ORBIT API is running"}

    # Serve React frontend for all non-API routes (production)
    if has_static:
        @app.route("/", defaults={"path": ""})
        @app.route("/<path:path>")
        def serve_frontend(path):
            file_path = os.path.join(app.static_folder, path)
            if path and os.path.exists(file_path):
                return send_from_directory(app.static_folder, path)
            return send_from_directory(app.static_folder, "index.html")

    return app


# Gunicorn uses this
app = create_app()

if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "false").lower() == "true", port=5000)
