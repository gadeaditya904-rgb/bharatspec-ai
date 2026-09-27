@echo off
echo =========================================================================
echo  BharatSpec AI - Indian Standards & Procurement Intelligence Platform
echo =========================================================================
echo.
echo Starting Backend (FastAPI on http://127.0.0.1:8000)...
start "BharatSpec AI Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Frontend (Vite on http://localhost:5173)...
start "BharatSpec AI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched!
echo Access the platform in your browser at: http://localhost:5173
echo API Swagger Docs available at:          http://127.0.0.1:8000/docs
echo.
