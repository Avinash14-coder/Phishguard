# Run PhishGuard FastAPI backend from project root
Write-Host "Starting PhishGuard backend..." -ForegroundColor Green
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001
