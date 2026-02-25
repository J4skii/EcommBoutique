@echo off
echo ========================================
echo Paitons Boutique - Quick Setup
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo Creating .env.local from template...
    copy .env.example .env.local
    echo.
    echo ⚠️  IMPORTANT: Edit .env.local and add your credentials!
    echo.
    pause
    notepad .env.local
) else (
    echo .env.local already exists
)

echo.
echo ========================================
echo Installing dependencies...
echo ========================================
call npm install

echo.
echo ========================================
echo Starting development server...
echo ========================================
echo.
echo Your site will be available at:
echo   http://localhost:3000
echo.
echo Test accounts:
echo   Admin: admin@paitonsboutique.co.za / admin123
echo   Customer: Sign up with your phone number
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
