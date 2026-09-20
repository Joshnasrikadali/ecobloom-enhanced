from flask import Blueprint, request, jsonify
from database import get_db
from utils.auth import require_auth

game_bp = Blueprint("gamification", __name__)


@game_bp.get("/points")
@require_auth
def get_points(user_id):
    with get_db() as db:
        row = db.execute("SELECT points FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"points": row["points"]})


@game_bp.put("/points")
@require_auth
def update_points(user_id):
    data = request.get_json(silent=True) or {}
    points = int(data.get("pointsToAdd", 0) or 0)
    if points < 0:
        return jsonify({"message": "Invalid pointsToAdd value"}), 400
    with get_db() as db:
        db.execute("UPDATE users SET points = points + ? WHERE id = ?", (points, user_id))
    return jsonify({"message": "Points updated successfully"})


@game_bp.put("/redeem-reward")
@require_auth
def redeem_reward(user_id):
    data = request.get_json(silent=True) or {}
    points = int(data.get("pointsToRedeem", 0) or 0)
    if points <= 0:
        return jsonify({"message": "Invalid points value"}), 400
    with get_db() as db:
        row = db.execute("SELECT points FROM users WHERE id = ?", (user_id,)).fetchone()
        if not row:
            return jsonify({"message": "User not found"}), 404
        if row["points"] < points:
            return jsonify({"message": "Insufficient points"}), 400
        db.execute("UPDATE users SET points = points - ? WHERE id = ?", (points, user_id))
    return jsonify({"message": "Reward redeemed successfully"})
