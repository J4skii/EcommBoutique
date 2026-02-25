@echo off
echo Fixing dependency conflicts...
echo.

REM Clean npm cache
echo Cleaning npm cache...
npm cache clean --force

REM Remove node_modules and lock files
echo Removing old dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist pnpm-lock.yaml del pnpm-lock.yaml

REM Install with legacy peer deps
echo Installing dependencies (this may take a few minutes)...
npm install --legacy-peer-deps

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Now run: npm run dev
echo.
pause
