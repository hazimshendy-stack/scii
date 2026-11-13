@echo off
cd /d "%~dp0"
echo ==============================================
echo        Starting Local Development Server
echo ==============================================
echo.

if not exist node_modules (
    echo [INFO] Installing dependencies...
    call npm install
)

echo [INFO] Launching Vite Dev Server...
call npm run dev
pause
