@echo off
cd /d "%~dp0"
"C:\Program Files\dotnet\dotnet.exe" build ".\mobile\StudentDirectory.App" -f net8.0-windows10.0.19041.0
"C:\Program Files\dotnet\dotnet.exe" run --project ".\mobile\StudentDirectory.App" -f net8.0-windows10.0.19041.0
pause
