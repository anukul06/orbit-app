"""
ORBIT — Database Layer
Uses raw sqlite3. Auto-creates database.db and all tables.
"""

import sqlite3
import os
import json

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "database.db")


def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS User_Profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        name TEXT DEFAULT '', age TEXT DEFAULT '', college TEXT DEFAULT '',
        year_of_study TEXT DEFAULT '', degree TEXT DEFAULT '',
        field TEXT DEFAULT '', substream TEXT DEFAULT '',
        skill_level TEXT DEFAULT '', hours_per_day INTEGER DEFAULT 2,
        clarity_score INTEGER DEFAULT 0, streak INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Streams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, selected_field TEXT, selected_stream TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, task_title TEXT, completed INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'medium', deadline TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Roadmap (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, week INTEGER, title TEXT, topics TEXT,
        project TEXT DEFAULT '', status TEXT DEFAULT 'upcoming',
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Reflections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, reflection_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    # --- NEW TABLES ---

    c.execute("""CREATE TABLE IF NOT EXISTS User_Settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        dark_mode INTEGER DEFAULT 1,
        notifications_enabled INTEGER DEFAULT 1,
        weekly_summary INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Community_Posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, field TEXT, stream TEXT,
        title TEXT, content TEXT, likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Community_Comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER, user_id INTEGER, comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES Community_Posts(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Post_Likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER, user_id INTEGER,
        UNIQUE(post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES Community_Posts(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Followers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        follower_id INTEGER, following_id INTEGER,
        UNIQUE(follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES Users(id),
        FOREIGN KEY (following_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER, receiver_id INTEGER, message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES Users(id),
        FOREIGN KEY (receiver_id) REFERENCES Users(id)
    )""")

    conn.commit()
    conn.close()
    print("✅ Database initialized — database.db ready")


def generate_default_roadmap(user_id, field, substream):
    templates = {
        'AI': [
            {'week': 1, 'title': 'Foundations & Setup', 'topics': ['Intro to AI concepts', 'Python fundamentals', 'Dev environment setup', 'Linear algebra refresher'], 'project': 'Hello AI: Simple chatbot'},
            {'week': 2, 'title': 'Data & Algorithms', 'topics': ['NumPy & Pandas', 'Data preprocessing', 'Search algorithms', 'Probability basics'], 'project': 'Data Wrangling: Clean a dataset'},
            {'week': 3, 'title': 'Machine Learning Core', 'topics': ['Supervised learning', 'Regression models', 'Classification', 'Model evaluation'], 'project': 'Housing price predictor'},
            {'week': 4, 'title': 'Neural Networks', 'topics': ['Neural net fundamentals', 'Build from scratch', 'TensorFlow intro', 'Capstone planning'], 'project': 'Image classifier CNN'},
        ],
        'Data Science': [
            {'week': 1, 'title': 'Data Foundations', 'topics': ['Python for DS', 'Pandas deep dive', 'Data types & cleaning', 'Exploratory data analysis'], 'project': 'EDA on public dataset'},
            {'week': 2, 'title': 'Statistics & Viz', 'topics': ['Descriptive statistics', 'Probability', 'Matplotlib & Seaborn', 'Hypothesis testing'], 'project': 'Statistical analysis report'},
            {'week': 3, 'title': 'Machine Learning', 'topics': ['Scikit-learn basics', 'Regression', 'Classification', 'Cross-validation'], 'project': 'Predictive model'},
            {'week': 4, 'title': 'Advanced DS', 'topics': ['Feature engineering', 'Ensemble methods', 'SQL for DS', 'Dashboard building'], 'project': 'End-to-end DS pipeline'},
        ],
        'Web Development': [
            {'week': 1, 'title': 'HTML & CSS', 'topics': ['HTML5 semantics', 'CSS Flexbox & Grid', 'Responsive design', 'Accessibility'], 'project': 'Portfolio website'},
            {'week': 2, 'title': 'JavaScript Core', 'topics': ['ES6+ features', 'DOM manipulation', 'Async/await', 'Fetch API'], 'project': 'Interactive web app'},
            {'week': 3, 'title': 'React Basics', 'topics': ['Components & JSX', 'State & props', 'Hooks', 'React Router'], 'project': 'React CRUD app'},
            {'week': 4, 'title': 'Full Stack', 'topics': ['Node.js basics', 'REST APIs', 'Database integration', 'Deployment'], 'project': 'Full-stack project'},
        ],
        'default': [
            {'week': 1, 'title': 'Foundations', 'topics': ['Core concepts overview', 'Essential tools setup', 'Fundamentals review', 'First practice exercises'], 'project': 'Starter project'},
            {'week': 2, 'title': 'Building Blocks', 'topics': ['Intermediate concepts', 'Hands-on practice', 'Problem solving', 'Resource exploration'], 'project': 'Practice project'},
            {'week': 3, 'title': 'Applied Learning', 'topics': ['Real-world applications', 'Project development', 'Best practices', 'Peer review'], 'project': 'Applied project'},
            {'week': 4, 'title': 'Mastery & Beyond', 'topics': ['Advanced topics', 'Portfolio building', 'Interview prep', 'Next steps planning'], 'project': 'Capstone project'},
        ],
    }
    plan = templates.get(substream, templates['default'])
    db = get_db()
    db.execute("DELETE FROM Roadmap WHERE user_id = ?", (user_id,))
    for item in plan:
        db.execute(
            "INSERT INTO Roadmap (user_id, week, title, topics, project, status) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, item['week'], item['title'], json.dumps(item['topics']), item['project'],
             'completed' if item['week'] == 1 else ('in-progress' if item['week'] == 2 else 'upcoming'))
        )
    db.commit()
    db.close()


def generate_default_tasks(user_id):
    tasks = [
        ("Review introductory materials", "high", "Today"),
        ("Set up development environment", "high", "Today"),
        ("Complete first practice exercise", "medium", "Today"),
        ("Watch introductory lecture", "medium", "Tomorrow"),
        ("Read documentation basics", "low", "Tomorrow"),
        ("Submit Week 1 Reflection", "high", "In 2 days"),
        ("Start mini-project planning", "medium", "In 3 days"),
        ("Practice coding challenge", "low", "In 3 days"),
    ]
    db = get_db()
    db.execute("DELETE FROM Tasks WHERE user_id = ?", (user_id,))
    for title, priority, deadline in tasks:
        db.execute("INSERT INTO Tasks (user_id, task_title, priority, deadline) VALUES (?, ?, ?, ?)",
                   (user_id, title, priority, deadline))
    db.commit()
    db.close()


if __name__ == "__main__":
    init_db()
