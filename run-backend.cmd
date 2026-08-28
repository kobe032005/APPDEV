@echo off
cd /d "%~dp0"
"C:\Program Files\dotnet\dotnet.exe" run --project ".\backend\StudentDirectory.Api" --urls "http://localhost:5000"
pause
