from flask import Blueprint, jsonify, request
from services.eco_assistant import reply_to

assistant_bp = Blueprint("assistant", __name__)


@assistant_bp.post("/chat")
def chat():
    message = (request.get_json(silent=True) or {}).get("message", "").strip()
    if not message:
        return jsonify({"success": False, "message": "Please enter a question."}), 400
    if len(message) > 1000:
        return jsonify({"success": False, "message": "Please keep your question under 1,000 characters."}), 400
    return jsonify({"success": True, "reply": reply_to(message)})
