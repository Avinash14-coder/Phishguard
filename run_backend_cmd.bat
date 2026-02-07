@echo off
cd /d "%~dp0"
echo Starting PhishGuard backend on http://127.0.0.1:8001 ...
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001
pause
