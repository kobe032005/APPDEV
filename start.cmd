@echo off
cd /d "%~dp0"
start "Student Directory API" cmd /k call "%~dp0run-backend.cmd"
timeout /t 3 /nobreak >nul
start "Student Directory App" cmd /k call "%~dp0run-app.cmd"
