from flask import Blueprint, request, jsonify
from database import get_db
from services.carbon_calculator import calculate_emissions
from utils.auth import get_current_user_id

footprint_bp = Blueprint("footprint", __name__)


@footprint_bp.post("/calculate")
def calculate():
    data = request.get_json(silent=True) or {}
    footprint = calculate_emissions(data)
    user_id = get_current_user_id(optional=True)
    with get_db() as db:
        db.execute(
            "INSERT INTO footprints(user_id,transport,energy,food,shopping,total) VALUES(?,?,?,?,?,?)",
            (user_id, footprint["transportEmissions"], footprint["electricityEmissions"], footprint["foodEmissions"], footprint["shoppingEmissions"], footprint["total"]),
        )
    return jsonify({"success": True, "message": "Carbon footprint calculated and saved", "footprint": footprint})
