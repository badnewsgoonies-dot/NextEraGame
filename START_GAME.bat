@echo off
echo ========================================
echo   NextEraGame - Starting Dev Server
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [WARNING] node_modules not found!
    echo Installing dependencies...
    echo.
    npm install
    echo.
)

REM Start the dev server
echo Starting Vite dev server...
echo.
echo Game will open at: http://localhost:5173/
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev

pause
