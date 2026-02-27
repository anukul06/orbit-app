"""
ORBIT — Community Routes
Posts, comments, likes, follows.
"""

from flask import Blueprint, request, jsonify, session
from database import get_db

community_bp = Blueprint("community", __name__)


@community_bp.route("/posts", methods=["GET"])
def get_posts():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    field = request.args.get("field", "")
    stream = request.args.get("stream", "")

    db = get_db()
    query = "SELECT p.*, u.email, up.name as author_name FROM Community_Posts p JOIN Users u ON p.user_id = u.id LEFT JOIN User_Profile up ON p.user_id = up.user_id"
    params = []

    if field:
        query += " WHERE p.field = ?"
        params.append(field)
        if stream:
            query += " AND p.stream = ?"
            params.append(stream)

    query += " ORDER BY p.created_at DESC LIMIT 50"
    rows = db.execute(query, params).fetchall()

    posts = []
    for r in rows:
        comments_count = db.execute("SELECT COUNT(*) as c FROM Community_Comments WHERE post_id = ?", (r["id"],)).fetchone()["c"]
        liked = db.execute("SELECT id FROM Post_Likes WHERE post_id = ? AND user_id = ?", (r["id"], user_id)).fetchone()
        posts.append({
            "id": r["id"], "user_id": r["user_id"],
            "author": r["author_name"] or r["email"].split("@")[0],
            "field": r["field"], "stream": r["stream"],
            "title": r["title"], "content": r["content"],
            "likes": r["likes"], "liked": bool(liked),
            "comments_count": comments_count,
            "created_at": r["created_at"],
        })
    db.close()
    return jsonify({"posts": posts}), 200


@community_bp.route("/posts", methods=["POST"])
def create_post():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    db = get_db()
    stream_row = db.execute("SELECT * FROM Streams WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.execute("INSERT INTO Community_Posts (user_id, field, stream, title, content) VALUES (?,?,?,?,?)",
               (user_id, data.get("field", stream_row["selected_field"] if stream_row else ""),
                data.get("stream", stream_row["selected_stream"] if stream_row else ""), title, content))
    db.commit()
    post = db.execute("SELECT * FROM Community_Posts WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,)).fetchone()
    db.close()

    return jsonify({"post": {"id": post["id"], "title": post["title"]}}), 201


@community_bp.route("/posts/<int:post_id>/like", methods=["POST"])
def toggle_like(post_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    existing = db.execute("SELECT id FROM Post_Likes WHERE post_id = ? AND user_id = ?", (post_id, user_id)).fetchone()
    if existing:
        db.execute("DELETE FROM Post_Likes WHERE post_id = ? AND user_id = ?", (post_id, user_id))
        db.execute("UPDATE Community_Posts SET likes = likes - 1 WHERE id = ?", (post_id,))
    else:
        db.execute("INSERT INTO Post_Likes (post_id, user_id) VALUES (?,?)", (post_id, user_id))
        db.execute("UPDATE Community_Posts SET likes = likes + 1 WHERE id = ?", (post_id,))
    db.commit()
    post = db.execute("SELECT likes FROM Community_Posts WHERE id = ?", (post_id,)).fetchone()
    db.close()
    return jsonify({"likes": post["likes"], "liked": not bool(existing)}), 200


@community_bp.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    db = get_db()
    rows = db.execute("""SELECT c.*, u.email, up.name as author_name
        FROM Community_Comments c JOIN Users u ON c.user_id = u.id
        LEFT JOIN User_Profile up ON c.user_id = up.user_id
        WHERE c.post_id = ? ORDER BY c.created_at ASC""", (post_id,)).fetchall()
    db.close()

    return jsonify({"comments": [{
        "id": r["id"], "user_id": r["user_id"],
        "author": r["author_name"] or r["email"].split("@")[0],
        "comment": r["comment"], "created_at": r["created_at"],
    } for r in rows]}), 200


@community_bp.route("/posts/<int:post_id>/comments", methods=["POST"])
def add_comment(post_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json() or {}
    comment = data.get("comment", "").strip()
    if not comment:
        return jsonify({"error": "Comment is required"}), 400

    db = get_db()
    db.execute("INSERT INTO Community_Comments (post_id, user_id, comment) VALUES (?,?,?)", (post_id, user_id, comment))
    db.commit()
    db.close()
    return jsonify({"message": "Comment added"}), 201


@community_bp.route("/follow/<int:target_id>", methods=["POST"])
def toggle_follow(target_id):
    user_id = session.get("user_id")
    if not user_id or user_id == target_id:
        return jsonify({"error": "Invalid"}), 400

    db = get_db()
    existing = db.execute("SELECT id FROM Followers WHERE follower_id = ? AND following_id = ?", (user_id, target_id)).fetchone()
    if existing:
        db.execute("DELETE FROM Followers WHERE follower_id = ? AND following_id = ?", (user_id, target_id))
    else:
        db.execute("INSERT INTO Followers (follower_id, following_id) VALUES (?,?)", (user_id, target_id))
    db.commit()
    db.close()
    return jsonify({"following": not bool(existing)}), 200
