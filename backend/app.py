from flask import Flask, jsonify
from flask_cors import CORS
from config import PORT
from database import init_db
from routes.auth_routes import auth_bp
from routes.footprint_routes import footprint_bp
from routes.gamification_routes import game_bp
from routes.bill_routes import bill_bp
from routes.user_routes import user_bp
from routes.assistant_routes import assistant_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

init_db()

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(footprint_bp, url_prefix="/api/footprint")
app.register_blueprint(game_bp, url_prefix="/api/gamification")
app.register_blueprint(bill_bp, url_prefix="/api/bill")
app.register_blueprint(user_bp, url_prefix="/api/user")
app.register_blueprint(assistant_bp, url_prefix="/api/assistant")


@app.get("/")
def home():
    return jsonify({"success": True, "message": "EcoBloom API is running 🌱"})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    print(f"🌱 EcoBloom Python backend running at http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
