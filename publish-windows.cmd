@echo off
cd /d "%~dp0"
if not exist publish mkdir publish
"C:\Program Files\dotnet\dotnet.exe" publish ".\mobile\StudentDirectory.App" -f net8.0-windows10.0.19041.0 -c Release -o ".\publish\StudentDirectory.App" -m:1
if errorlevel 1 (echo Publish failed. & pause & exit /b 1)
echo Published to publish\StudentDirectory.App
pause
