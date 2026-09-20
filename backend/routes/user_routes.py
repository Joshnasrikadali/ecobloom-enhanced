from flask import Blueprint, jsonify
from database import get_db
from utils.auth import require_auth

user_bp = Blueprint("user", __name__)


@user_bp.get("/profile")
@require_auth
def profile(user_id):
    with get_db() as db:
        user = db.execute(
            "SELECT id, name, email, points, created_at FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        latest = db.execute(
            """
            SELECT transport, energy, food, shopping, total, created_at
            FROM footprints
            WHERE user_id = ?
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT 1
            """,
            (user_id,),
        ).fetchone()

        history_rows = db.execute(
            """
            SELECT id, transport, energy, food, shopping, total, created_at
            FROM footprints
            WHERE user_id = ?
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT 30
            """,
            (user_id,),
        ).fetchall()

    latest_data = dict(latest) if latest else None
    history = [dict(row) for row in history_rows]

    # Return oldest-to-newest for charts.
    history.reverse()

    return jsonify({
        "success": True,
        "user": dict(user),
        "latest": latest_data,
        "history": history,
    })
