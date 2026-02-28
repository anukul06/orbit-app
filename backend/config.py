"""
ORBIT — Configuration
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "orbit-dev-secret-key-change-in-prod")
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
