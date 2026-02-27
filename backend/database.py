"""
ORBIT — Database Layer
Uses raw sqlite3. Auto-creates database.db and all tables.
Roadmap templates are substream-specific with Week → Day structure.
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
        week INTEGER DEFAULT 1, day INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Roadmap (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, week INTEGER, day INTEGER,
        title TEXT, topics TEXT,
        project TEXT DEFAULT '', status TEXT DEFAULT 'upcoming',
        completed INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Reflections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, reflection_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )""")

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


# ─── Substream-specific roadmap templates (Week → Day) ───────────────

ROADMAP_TEMPLATES = {
    "Data Science": {
        1: {"title": "Python Foundations", "days": [
            "Variables & Data Types", "Operators & Conditions", "Loops & Iteration",
            "Functions & Scope", "Lists & Dictionaries", "Practice Problems", "Mini Project: Calculator App"
        ], "project": "Calculator App"},
        2: {"title": "Data Handling", "days": [
            "NumPy Basics", "Pandas DataFrames", "Data Cleaning Techniques",
            "Data Visualization (Matplotlib)", "EDA Concepts", "Practice Dataset Analysis", "Mini Project: Sales Dashboard"
        ], "project": "Sales Dashboard"},
        3: {"title": "Statistics & ML Intro", "days": [
            "Descriptive Statistics", "Probability Basics", "Hypothesis Testing",
            "Linear Regression", "Classification Intro", "Scikit-learn Basics", "Mini Project: Prediction Model"
        ], "project": "Prediction Model"},
        4: {"title": "Advanced Analysis", "days": [
            "Feature Engineering", "Cross-validation", "Ensemble Methods",
            "SQL for Data Science", "Dashboard Building", "Portfolio Prep", "Capstone: End-to-End Pipeline"
        ], "project": "End-to-End Pipeline"},
    },

    "Artificial Intelligence": {
        1: {"title": "AI Foundations", "days": [
            "Intro to AI Concepts", "Python for AI", "Linear Algebra Refresher",
            "Probability & Statistics", "Search Algorithms", "Practice Problems", "Mini Project: Simple Chatbot"
        ], "project": "Simple Chatbot"},
        2: {"title": "Data & Preprocessing", "days": [
            "NumPy Deep Dive", "Pandas for AI", "Data Cleaning",
            "Feature Extraction", "Data Augmentation", "Visualization", "Mini Project: Data Pipeline"
        ], "project": "Data Pipeline"},
        3: {"title": "Machine Learning Core", "days": [
            "Supervised Learning", "Regression Models", "Classification",
            "Decision Trees & Random Forests", "Model Evaluation Metrics", "Hyperparameter Tuning", "Mini Project: Spam Classifier"
        ], "project": "Spam Classifier"},
        4: {"title": "Neural Networks", "days": [
            "Neural Net Fundamentals", "Activation Functions", "Backpropagation",
            "TensorFlow Intro", "CNN Basics", "Transfer Learning", "Capstone: Image Classifier"
        ], "project": "Image Classifier"},
    },

    "Machine Learning": {
        1: {"title": "Math & Python", "days": [
            "Linear Algebra Essentials", "Calculus for ML", "Python NumPy",
            "Pandas Data Wrangling", "Probability Distributions", "Practice Exercises", "Mini Project: Math Visualizer"
        ], "project": "Math Visualizer"},
        2: {"title": "Supervised Learning", "days": [
            "Linear Regression", "Logistic Regression", "Decision Trees",
            "Random Forests", "SVM Basics", "Cross-validation", "Mini Project: House Price Predictor"
        ], "project": "House Price Predictor"},
        3: {"title": "Unsupervised & Deep Learning", "days": [
            "K-Means Clustering", "PCA & Dimensionality Reduction", "Neural Networks Intro",
            "Keras & TensorFlow", "CNNs", "RNNs Intro", "Mini Project: Customer Segmentation"
        ], "project": "Customer Segmentation"},
        4: {"title": "Deployment & Portfolio", "days": [
            "Model Serialization (Pickle/Joblib)", "Flask API for ML", "Docker Basics",
            "MLOps Intro", "Model Monitoring", "Portfolio Building", "Capstone: Full ML Pipeline"
        ], "project": "Full ML Pipeline"},
    },

    "Web Development": {
        1: {"title": "HTML & CSS", "days": [
            "HTML5 Semantics", "CSS Box Model", "Flexbox Layout",
            "CSS Grid", "Responsive Design", "Accessibility Basics", "Mini Project: Portfolio Page"
        ], "project": "Portfolio Page"},
        2: {"title": "JavaScript Core", "days": [
            "Variables & Types", "Functions & Scope", "DOM Manipulation",
            "Event Handling", "Async/Await & Promises", "Fetch API", "Mini Project: Interactive App"
        ], "project": "Interactive App"},
        3: {"title": "React Basics", "days": [
            "Components & JSX", "Props & State", "React Hooks",
            "React Router", "Forms & Validation", "API Integration", "Mini Project: React CRUD App"
        ], "project": "React CRUD App"},
        4: {"title": "Full Stack", "days": [
            "Node.js & Express", "REST API Design", "Database (MongoDB/SQL)",
            "Authentication (JWT)", "Deployment (Vercel/Railway)", "Testing Basics", "Capstone: Full-Stack Project"
        ], "project": "Full-Stack Project"},
    },

    "Cybersecurity": {
        1: {"title": "Networking Foundations", "days": [
            "OSI Model", "TCP/IP Protocols", "DNS & DHCP",
            "Firewalls & NAT", "Wireshark Basics", "Network Scanning", "Mini Project: Network Monitor"
        ], "project": "Network Monitor"},
        2: {"title": "Linux & Systems", "days": [
            "Linux CLI Fundamentals", "File Permissions", "Process Management",
            "Shell Scripting", "Logs & Monitoring", "System Hardening", "Mini Project: Security Audit Script"
        ], "project": "Security Audit Script"},
        3: {"title": "Offensive Security", "days": [
            "OWASP Top 10", "SQL Injection", "XSS Attacks",
            "Brute Force & Enumeration", "Burp Suite Basics", "Pen Testing Methodology", "Mini Project: Vuln Scanner"
        ], "project": "Vuln Scanner"},
        4: {"title": "Defense & Forensics", "days": [
            "Cryptography Basics", "IDS/IPS Systems", "Incident Response",
            "Digital Forensics", "Security Policies", "Career Prep (CEH/CompTIA)", "Capstone: Security Report"
        ], "project": "Security Report"},
    },

    "Structural Engineering": {
        1: {"title": "Mechanics Foundations", "days": [
            "Statics & Equilibrium", "Free Body Diagrams", "Moments & Forces",
            "Stress & Strain", "Material Properties", "Practice Problems", "Mini Project: Truss Analysis"
        ], "project": "Truss Analysis"},
        2: {"title": "Structural Analysis", "days": [
            "Beam Theory", "Shear & Moment Diagrams", "Deflection Methods",
            "Indeterminate Structures", "Matrix Methods", "Software Intro (SAP2000)", "Mini Project: Bridge Design"
        ], "project": "Bridge Design"},
        3: {"title": "Concrete Design", "days": [
            "RC Beam Design", "Column Design", "Slab Design",
            "Foundation Types", "Detailing & IS Codes", "Practice Designs", "Mini Project: Building Frame"
        ], "project": "Building Frame"},
        4: {"title": "Steel & Advanced", "days": [
            "Steel Connections", "Tension & Compression Members", "Plate Girders",
            "Earthquake Resistant Design", "Wind Load Analysis", "Portfolio Prep", "Capstone: Complete Structure"
        ], "project": "Complete Structure Design"},
    },

    # ─── Medical streams ───
    "Cardiology": {
        1: {"title": "Cardiac Anatomy", "days": [
            "Heart Chambers & Valves", "Coronary Circulation", "Cardiac Cycle",
            "ECG Basics", "Heart Sounds", "Practice Cases", "Case Study Review"
        ], "project": "ECG Interpretation Report"},
        2: {"title": "Cardiac Pathology", "days": [
            "Ischemic Heart Disease", "Heart Failure Types", "Valvular Diseases",
            "Arrhythmias", "Hypertension", "Practice Questions", "Clinical Case Analysis"
        ], "project": "Pathology Case Study"},
        3: {"title": "Diagnostics", "days": [
            "ECG Advanced", "Echocardiography", "Cardiac Catheterization",
            "Stress Testing", "Cardiac Biomarkers", "Practice Interpretation", "Diagnostic Report"
        ], "project": "Diagnostic Report"},
        4: {"title": "Treatment & Management", "days": [
            "Pharmacology", "PCI & CABG", "Cardiac Rehabilitation",
            "Emergency Management", "Preventive Cardiology", "Research Review", "Capstone: Treatment Plan"
        ], "project": "Treatment Plan"},
    },

    # ─── Commerce streams ───
    "Investment Banking": {
        1: {"title": "Financial Foundations", "days": [
            "Financial Statements", "Time Value of Money", "Ratio Analysis",
            "Corporate Finance Basics", "Excel for Finance", "Practice Problems", "Mini Project: Company Analysis"
        ], "project": "Company Analysis"},
        2: {"title": "Valuation", "days": [
            "DCF Modeling", "Comparable Company Analysis", "Precedent Transactions",
            "LBO Basics", "WACC Calculation", "Practice Valuations", "Mini Project: Valuation Model"
        ], "project": "Valuation Model"},
        3: {"title": "M&A & Markets", "days": [
            "M&A Process", "Due Diligence", "Deal Structuring",
            "IPO Process", "Debt Markets", "Pitch Book Basics", "Mini Project: Mock Pitch Book"
        ], "project": "Mock Pitch Book"},
        4: {"title": "Advanced & Interview Prep", "days": [
            "Financial Modeling", "Case Study Practice", "Technical Questions",
            "Behavioral Questions", "Networking Strategy", "Portfolio Building", "Capstone: Full Pitch"
        ], "project": "Full Pitch Presentation"},
    },

    # ─── Arts streams ───
    "Behavioral Economics": {
        1: {"title": "Foundations", "days": [
            "Classical vs Behavioral Economics", "Bounded Rationality", "Heuristics & Biases",
            "Prospect Theory", "Nudge Theory", "Reading: Thinking Fast & Slow", "Essay: Key Concepts"
        ], "project": "Concepts Essay"},
        2: {"title": "Decision Making", "days": [
            "Choice Architecture", "Anchoring Effect", "Loss Aversion",
            "Mental Accounting", "Status Quo Bias", "Experiment Design", "Mini Project: Survey"
        ], "project": "Behavioral Survey"},
        3: {"title": "Applications", "days": [
            "Policy Nudges", "Marketing Applications", "Health Decisions",
            "Financial Behavior", "Ethical Considerations", "Case Studies", "Analysis Report"
        ], "project": "Application Report"},
        4: {"title": "Research & Portfolio", "days": [
            "Research Methodology", "Data Collection", "Statistical Analysis",
            "Paper Writing", "Presentation Skills", "Portfolio Building", "Capstone: Research Paper"
        ], "project": "Research Paper"},
    },

    "Clinical Psychology": {
        1: {"title": "Psychology Foundations", "days": [
            "History of Psychology", "Research Methods", "Biological Bases",
            "Sensation & Perception", "Learning Theories", "Practice Questions", "Reflection Journal"
        ], "project": "Reflection Journal"},
        2: {"title": "Abnormal Psychology", "days": [
            "DSM-5 Overview", "Anxiety Disorders", "Mood Disorders",
            "Personality Disorders", "Psychotic Disorders", "Case Studies", "Diagnostic Report"
        ], "project": "Diagnostic Report"},
        3: {"title": "Therapeutic Approaches", "days": [
            "CBT Fundamentals", "Psychodynamic Therapy", "Humanistic Approach",
            "Group Therapy", "Ethics in Practice", "Role Play Practice", "Treatment Plan"
        ], "project": "Treatment Plan"},
        4: {"title": "Assessment & Career", "days": [
            "Psychological Testing", "Clinical Interview", "Report Writing",
            "Supervision & Training", "Career Paths", "Portfolio Building", "Capstone: Full Assessment"
        ], "project": "Full Assessment"},
    },
}

# Fallback generic template
_DEFAULT_TEMPLATE = {
    1: {"title": "Foundations", "days": [
        "Core Concepts Overview", "Essential Tools Setup", "Fundamentals Review",
        "Basic Practice Exercises", "Reading & Research", "Problem Solving", "Mini Project: Starter"
    ], "project": "Starter Project"},
    2: {"title": "Building Blocks", "days": [
        "Intermediate Concepts", "Hands-on Practice", "Problem Solving",
        "Resource Exploration", "Peer Discussion", "Skill Assessment", "Practice Project"
    ], "project": "Practice Project"},
    3: {"title": "Applied Learning", "days": [
        "Real-world Applications", "Project Development", "Best Practices",
        "Peer Review", "Advanced Techniques", "Case Studies", "Applied Project"
    ], "project": "Applied Project"},
    4: {"title": "Mastery & Beyond", "days": [
        "Advanced Topics", "Portfolio Building", "Interview Prep",
        "Networking", "Industry Trends", "Next Steps Planning", "Capstone Project"
    ], "project": "Capstone Project"},
}


def generate_default_roadmap(user_id, field, substream):
    """Generate a 4-week roadmap with daily breakdown based on user's substream."""
    template = ROADMAP_TEMPLATES.get(substream, _DEFAULT_TEMPLATE)

    db = get_db()
    db.execute("DELETE FROM Roadmap WHERE user_id = ?", (user_id,))

    for week_num, week_data in template.items():
        for day_idx, day_title in enumerate(week_data["days"], 1):
            status = "completed" if week_num == 1 and day_idx <= 2 else (
                "in-progress" if week_num == 1 else "upcoming"
            )
            db.execute(
                """INSERT INTO Roadmap (user_id, week, day, title, topics, project, status, completed)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (user_id, week_num, day_idx, day_title,
                 json.dumps({"week_title": week_data["title"]}),
                 week_data["project"] if day_idx == 7 else "",
                 status, 1 if status == "completed" else 0)
            )

    db.commit()
    db.close()


def generate_default_tasks(user_id):
    """Generate tasks for current week from roadmap."""
    db = get_db()
    db.execute("DELETE FROM Tasks WHERE user_id = ?", (user_id,))

    # Get week 1 days from roadmap to create matching tasks
    days = db.execute("SELECT * FROM Roadmap WHERE user_id = ? AND week = 1 ORDER BY day", (user_id,)).fetchall()
    if days:
        for d in days:
            priority = "high" if d["day"] <= 2 else ("medium" if d["day"] <= 5 else "low")
            deadline = "Today" if d["day"] <= 2 else ("Tomorrow" if d["day"] <= 4 else f"Day {d['day']}")
            db.execute(
                "INSERT INTO Tasks (user_id, task_title, priority, deadline, week, day) VALUES (?, ?, ?, ?, ?, ?)",
                (user_id, d["title"], priority, deadline, 1, d["day"])
            )
    else:
        # Fallback if no roadmap
        for title, priority, deadline in [
            ("Review introductory materials", "high", "Today"),
            ("Set up development environment", "high", "Today"),
            ("Complete first practice exercise", "medium", "Today"),
            ("Watch introductory lecture", "medium", "Tomorrow"),
        ]:
            db.execute("INSERT INTO Tasks (user_id, task_title, priority, deadline, week, day) VALUES (?, ?, ?, ?, ?, ?)",
                       (user_id, title, priority, deadline, 1, 0))

    db.commit()
    db.close()


if __name__ == "__main__":
    init_db()
