"""
ORBIT — Chat Routes
AI-powered chatbot using Groq (Llama3-70b) for career guidance.
"""

from flask import Blueprint, request, jsonify, session
import os

chat_bp = Blueprint("chat", __name__)

SYSTEM_PROMPT = """You are ORBIT AI, an intelligent academic and career guidance assistant. You help early-year students choose career paths, understand technical concepts, improve learning consistency, and plan structured growth. Provide clear, practical, and motivating advice. Keep answers concise but actionable."""


def build_user_context():
    """Build user context string from session/profile data."""
    user_id = session.get("user_id")
    if not user_id:
        return ""

    from database import get_db
    db = get_db()
    user = db.execute("SELECT * FROM Users WHERE id = ?", (user_id,)).fetchone()
    stream = db.execute("SELECT * FROM Streams WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.close()

    if not user:
        return ""

    parts = []
    if stream and stream["selected_field"]:
        parts.append(f"Field: {stream['selected_field']}")
    if stream and stream["selected_stream"]:
        parts.append(f"Substream: {stream['selected_stream']}")
    if "skill_level" in user.keys() and user["skill_level"]:
        parts.append(f"Skill Level: {user['skill_level']}")
    if "hours_per_day" in user.keys() and user["hours_per_day"]:
        parts.append(f"Studies {user['hours_per_day']} hours daily")

    if parts:
        return "\n\nUser context: " + ", ".join(parts) + "."
    return ""


@chat_bp.route("/", methods=["POST"])
def chat():
    """Send a message to the AI chatbot via Groq (Llama3-70b)."""
    data = request.get_json()
    message = (data or {}).get("message", "").strip()

    if not message:
        return jsonify({"error": "Message is required"}), 400

    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        return jsonify({"error": "Groq API key not configured. Set GROQ_API_KEY in .env"}), 500

    # Build conversation with history
    chat_history = session.get("chat_history", [])

    # System prompt with user context
    system_content = SYSTEM_PROMPT + build_user_context()

    messages = [{"role": "system", "content": system_content}]
    for msg in chat_history[-10:]:
        messages.append(msg)
    messages.append({"role": "user", "content": message})

    try:
        import httpx
        response = httpx.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": messages,
                "max_tokens": 500,
                "temperature": 0.7,
            },
            timeout=30,
        )
        result = response.json()

        if "error" in result:
            return jsonify({"error": result["error"].get("message", "API error")}), 500

        reply = result["choices"][0]["message"]["content"]

        # Save to session history
        chat_history.append({"role": "user", "content": message})
        chat_history.append({"role": "assistant", "content": reply})
        session["chat_history"] = chat_history[-10:]

        return jsonify({"reply": reply}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to get response: {str(e)}"}), 500


@chat_bp.route("/clear", methods=["POST"])
def clear_chat():
    """Clear chat history."""
    session.pop("chat_history", None)
    return jsonify({"message": "Chat cleared"}), 200
