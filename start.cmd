@echo off
cd /d "%~dp0"
start "Student Directory API" cmd /k call "%~dp0run-backend.cmd"
timeout /t 3 /nobreak >nul
start "" "http://localhost:5000"
