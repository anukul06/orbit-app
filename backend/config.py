"""
ORBIT — Configuration
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "orbit-dev-secret-key-change-in-prod")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///orbit.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"
