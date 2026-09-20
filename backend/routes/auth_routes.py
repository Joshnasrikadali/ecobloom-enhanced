from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db
from utils.auth import create_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    if not name or not email or not password:
        return jsonify({"success": False, "message": "Missing Details"}), 400
    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters"}), 400

    with get_db() as db:
        existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return jsonify({"success": False, "message": "User already exists!"}), 400
        cur = db.execute(
            "INSERT INTO users(name,email,password_hash) VALUES(?,?,?)",
            (name, email, generate_password_hash(password)),
        )
        user_id = cur.lastrowid

    return jsonify({"success": True, "message": "User registered successfully. You can now sign in."}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    with get_db() as db:
        user = db.execute("SELECT id,name,email,points,password_hash FROM users WHERE email = ?", (email,)).fetchone()
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"success": False, "message": "Invalid email or password"}), 400

    token = create_token(user["id"])
    safe_user = {"id": user["id"], "name": user["name"], "email": user["email"], "points": user["points"]}
    return jsonify({"success": True, "token": token, "user": safe_user, "message": "Login successful"})


@auth_bp.get("/verify-email/<token>")
def verify_email(token):
    return jsonify({"success": True, "message": "Email verification is not required in this local version."})


@auth_bp.post("/forgot-password")
def forgot_password():
    return jsonify({"success": False, "message": "Password reset email is not configured in this local version. Please use your account password."}), 501


@auth_bp.put("/reset-password/<token>")
def reset_password(token):
    return jsonify({"success": False, "message": "Password reset is not configured in this local version."}), 501
