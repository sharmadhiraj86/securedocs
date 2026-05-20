Set WshShell = CreateObject("WScript.Shell")

' 1. Kill any existing local servers and ngrok processes so they don't clash
WshShell.Run "taskkill /F /IM node.exe", 0, true
WshShell.Run "taskkill /F /IM ngrok.exe", 0, true

' 8. Add Ngrok Authtoken silently
WshShell.Run "cmd /c npx ngrok config add-authtoken 3DzckPaYXt9iLzZrgF1nOMnlExm_4QRG4nGLbSd9Vqjc4nKN7", 0, true

' 3. Start the Backend Server silently (using full absolute path)
WshShell.Run "cmd /c node C:\Users\Dell\.gemini\antigravity\scratch\securedocs\server\index.js", 0, false

' 4. Start the Admin Web UI silently (using full absolute path)
WshShell.Run "cmd /c cd /d C:\Users\Dell\.gemini\antigravity\scratch\securedocs\admin-web && npm run dev", 0, false

' 5. Wait 2 seconds for server to start
WScript.Sleep 2000

' 6. Start the Permanent Ngrok Tunnel completely silently (0 style = invisible window)
WshShell.Run "cmd /c npx ngrok http 3001 --url=tastiness-acclimate-case.ngrok-free.dev", 0, false

' 7. Wait 3 more seconds for tunnel to connect
WScript.Sleep 3000

' 8. Open the default web browser to the Admin Panel
WshShell.Run "http://localhost:5173"
