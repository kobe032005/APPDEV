@echo off
cd /d "%~dp0"
"C:\Program Files\dotnet\dotnet.exe" build ".\backend\StudentDirectory.Api" -m:1
if errorlevel 1 (echo Backend build failed. & pause & exit /b 1)
"C:\Program Files\dotnet\dotnet.exe" ".\backend\StudentDirectory.Api\bin\Debug\net8.0\StudentDirectory.Api.dll" --urls "http://localhost:5000"
pause
