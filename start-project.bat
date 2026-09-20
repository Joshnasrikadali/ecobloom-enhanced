@echo off
echo Starting Carbon Footprint Calculator...
echo.
start "Python Backend" cmd /k "cd /d %~dp0backend && py -m pip install -r requirements.txt && py app.py"
timeout /t 3 /nobreak >nul
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm start"
