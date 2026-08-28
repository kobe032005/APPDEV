# Student Directory

A C# student CRUD application built with ASP.NET Core Web API, Entity Framework Core, SQLite, Swagger/OpenAPI, and .NET MAUI Blazor Hybrid for Windows.

## Project Structure

- `backend/StudentDirectory.Api` - ASP.NET Core backend API
- `mobile/StudentDirectory.App` - .NET MAUI Windows desktop app
- `StudentDirectory.sln` - solution file
- `start.cmd` - opens the backend and desktop app
- `setup-windows.cmd` - setup for another Windows PC
- `publish-windows.cmd` - creates a click-to-run Windows publish folder
- `create-shortcuts.cmd` - creates Desktop and Start Menu shortcuts
- `run-backend.cmd` - starts only the backend
- `run-app.cmd` - starts only the desktop app

## Technologies

- ASP.NET Core Web API
- Entity Framework Core with SQLite
- Swagger / OpenAPI
- .NET MAUI Blazor Hybrid
- C#
- Git

## Requirements

Install on another Windows PC:

- .NET 8 SDK x64, only needed to build from source
- Git
- Windows App SDK support through the .NET MAUI workload

## Run

Run `setup-windows.cmd` once on a new computer. Then run `start.cmd`.

The API is available at `http://localhost:5000` and Swagger is at `http://localhost:5000/swagger`.

To publish the desktop app, run `publish-windows.cmd`. To create shortcuts, run `create-shortcuts.cmd`.

Student records are stored in the API's local `students.db` SQLite database.
