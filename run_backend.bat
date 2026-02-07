@echo off
REM Run PhishGuard FastAPI backend from project root (paths are resolved from backend folder)
echo Starting PhishGuard backend...
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001
pause
