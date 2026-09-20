# 🌱 Carbon Footprint Calculator

A React frontend with a Python Flask backend. The original frontend design has been retained while the Node/Express backend has been replaced with a simple Python API.

## Project structure

- `frontend/` React UI from the original project
- `backend/` Flask API, carbon calculator and SQLite database

## Requirements

- Python 3.10+
- Node.js 18+
- npm

## Run in VS Code on Windows

### 1. Open the project

Open the folder `Carbon-Footprint-Website-main` in VS Code.

### 2. Start Python backend

Open Terminal 1:

```powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

If PowerShell blocks activation, run the commands without activation:

```powershell
cd backend
py -m pip install -r requirements.txt
py app.py
```

Backend: http://localhost:5000

### 3. Start React frontend

Open Terminal 2:

```powershell
cd frontend
npm install
npm start
```

Frontend: http://localhost:3000

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/footprint/calculate`
- `GET /api/gamification/points`
- `PUT /api/gamification/points`
- `PUT /api/gamification/redeem-reward`
- `POST /api/bill/verify`
- `GET /api/health`

## Database

The backend automatically creates `backend/data/carbon_footprint.db` using SQLite. No MongoDB installation is required.

## Notes

- The React UI and existing pages are retained as the design base.
- Carbon calculation logic from the original JavaScript service has been ported to `backend/services/carbon_calculator.py`.
- Local authentication uses JWT and hashed passwords.
- Email verification/password-reset email delivery is intentionally disabled in this easy-to-run version.
- The bill endpoint is wired but does not perform OCR yet.

## EcoBloom updates

- App branding changed to **EcoBloom**.
- Profile data is loaded from SQLite for the authenticated user instead of hard-coded sample data.
- Profile history and latest category statistics are loaded from the user's footprint records.
- Added `GET /api/user/profile` for authenticated profile and footprint history data.
- Carbon results now classify the footprint as **Low**, **Moderate**, or **High Carbon Impact**.
- SQLite remains the local SQL database, with `users` and `footprints` linked by `user_id`.

## College project enhancement: EcoGuide, real-life analytics and learning games

The original **Track Your Carbon Footprint** hero and calculator flow are preserved. The enhancement makes the results easier for a non-technical person to understand and adds an engagement loop:

- **Real-life analytics below the hero:** an interactive commute comparison converts distance and days into estimated monthly CO₂ for driving alone versus public transport. It also gives achievable home-energy and food actions. The factors match the calculator's transport logic, and the UI clearly labels the figures as estimates.
- **EcoGuide chat:** the floating assistant is available from every page. It gives concise, practical advice about transport, electricity, food and shopping. It works offline using local guidance. Add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) to `backend/.env` to use an OpenAI model through the Responses API instead.
- **Learn & Play:** the More menu links to two educational mini-games: a commute-choice challenge and a waste-sorting challenge. The feedback explains the reason for each answer and ties it to the same daily choices measured by the calculator.

### New files

- `backend/routes/assistant_routes.py` — `POST /api/assistant/chat`
- `backend/services/eco_assistant.py` — optional OpenAI Responses API integration plus offline fallback
- `frontend/src/components/RealLifeAnalytics/` — landing-page everyday comparison
- `frontend/src/components/EcoChatWidget/` — accessible site-wide chat widget
- `frontend/src/pages/LearnPlay.jsx` — classroom-friendly mini-games

### Suggested professor demo flow

1. Open the home page and move the commute sliders to explain how a monthly estimate is built from a familiar journey.
2. Click **Calculate** and complete the existing transport, electricity, food and shopping questions.
3. Show the results pie chart, practical tips and saved profile history.
4. Ask EcoGuide a question such as “How can I lower my travel footprint?” to demonstrate personalised, conversational guidance.
5. Open **More → Learn & Play** and explain that the games reinforce the same behaviour choices rather than being unrelated entertainment.

### Run the enhanced version

Use two terminals from this folder:

```powershell
cd backend
python -m pip install -r requirements.txt
python app.py
```

```powershell
cd frontend
npm install
npm start
```

Then open http://localhost:3000. The React development server forwards API requests to Flask at http://localhost:5000.
