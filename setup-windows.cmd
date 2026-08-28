@echo off
setlocal
where git >nul 2>nul || (echo Install Git for Windows first: https://git-scm.com/download/win & pause & exit /b 1)
if not exist "%ProgramFiles%\dotnet\dotnet.exe" (echo Install .NET 8 SDK x64 first: https://dotnet.microsoft.com/download/dotnet/8.0 & pause & exit /b 1)
"%ProgramFiles%\dotnet\dotnet.exe" workload install maui
"%ProgramFiles%\dotnet\dotnet.exe" restore ".\StudentDirectory.sln"
if errorlevel 1 (echo Restore failed. & pause & exit /b 1)
call "%~dp0publish-windows.cmd"
echo Setup complete. Run start.cmd to launch the application.
pause
