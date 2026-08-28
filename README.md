# Student Records System

This repository contains a student records system with an ASP.NET Core Web API backend and a C# Blazor WebAssembly dashboard. The backend persists records in a local SQLite database through Entity Framework Core and exposes Swagger/OpenAPI documentation.

## Features
- Add students with a unique student ID, full name, email, phone, course name, course code, year level, section, enrollment date, status, and address.
- Read and display students in a directory table.
- Update existing students using the edit button.
- Delete students with confirmation.
- Input validation prevents incomplete fields and duplicate student IDs.
- Student records persist in SQLite through Entity Framework Core.
- REST endpoints are available under `/api/students`.
- Swagger UI is available at `/swagger` while the API is running.

## Files
- `frontend/StudentRecords.Web`: C# Blazor WebAssembly dashboard, typed API client, and UI styling.
- `index.html`, `styles.css`, `script.js`: Original static prototype retained for reference.
- `backend/StudentRecords.Api`: ASP.NET Core Web API, EF Core DbContext, SQLite database, and Swagger.
- `mobile/StudentRecords.Mobile`: .NET MAUI client location, created after installing the MAUI workload.

## Running
Run the API from PowerShell:

```powershell
& 'C:\Program Files\dotnet\dotnet.exe' run --project .\backend\StudentRecords.Api
```

Open `http://localhost:5000/swagger` to inspect and test the API. The SQLite file is created as `students.db` in the API process directory.

Run the C# dashboard in a second terminal:

```powershell
& 'C:\Program Files\dotnet\dotnet.exe' run --project .\frontend\StudentRecords.Web
```

The Blazor dashboard expects the API at `http://localhost:5000`.

## Notes
The API is the source of truth for student records. The solution uses C# for the backend and dashboard; the MAUI client can share the same typed API model when the MAUI workload is available.
