@echo off
cd /d "%~dp0"
"C:\Program Files\dotnet\dotnet.exe" build ".\mobile\StudentDirectory.App" -f net8.0-windows10.0.19041.0 -m:1
if errorlevel 1 (echo MAUI app build failed. & pause & exit /b 1)
start "Student Directory App" /d "%~dp0mobile\StudentDirectory.App\bin\Debug\net8.0-windows10.0.19041.0\win10-x64" "StudentDirectory.App.exe"
pause
