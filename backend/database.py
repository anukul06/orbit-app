"""
ORBIT — Database Layer
Uses raw sqlite3 for hackathon simplicity.
Automatically creates database.db and all tables on app start.
"""

import sqlite3
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "database.db")


def get_db():
    """Get a database connection with foreign keys enabled."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Access columns by name
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """
    Initialize the database.
    Creates database.db file and all tables if they do not exist.
    """
    conn = get_db()
    cursor = conn.cursor()

    # Users table (with profile fields)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT DEFAULT '',
            age TEXT DEFAULT '',
            college TEXT DEFAULT '',
            year_of_study TEXT DEFAULT '',
            degree TEXT DEFAULT '',
            skill_level TEXT DEFAULT '',
            hours_per_day INTEGER DEFAULT 2
        )
    """)

    # Streams table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Streams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            selected_field TEXT,
            selected_stream TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
    """)

    # Tasks table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            task_title TEXT,
            completed INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
    """)

    # Reflections table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Reflections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            reflection_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialized — database.db ready")


if __name__ == "__main__":
    init_db()
