from functools import wraps
from flask import request, jsonify
import jwt
from config import SECRET_KEY


def create_token(user_id):
    return jwt.encode({"id": user_id}, SECRET_KEY, algorithm="HS256")


def get_current_user_id(optional=False):
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None if optional else None
    token = header.split(" ", 1)[1].strip()
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return int(payload["id"])
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        return None


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_current_user_id(optional=True)
        if not user_id:
            return jsonify({"success": False, "message": "Authentication required"}), 401
        return fn(user_id, *args, **kwargs)
    return wrapper
