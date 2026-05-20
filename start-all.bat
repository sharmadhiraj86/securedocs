@echo off
cd /d "%~dp0"
echo Starting SecureDocs Backend...
start cmd /k "cd server && node index.js"

echo Starting Admin Web...
start cmd /k "cd admin-web && npm run dev"

echo Starting Desktop Viewer...
start cmd /k "cd desktop-viewer && npm run dev"
