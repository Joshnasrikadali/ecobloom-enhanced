from flask import Blueprint, jsonify
from utils.auth import require_auth

bill_bp = Blueprint("bill", __name__)

@bill_bp.post("/verify")
@require_auth
def verify_bill(user_id):
    return jsonify({
        "success": True,
        "message": "Bill upload endpoint is connected. Automatic OCR verification can be added later.",
        "verified": False
    })
