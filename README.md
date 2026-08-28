# Student Directory

A localhost student CRUD web application built with ASP.NET Core Web API, Entity Framework Core, SQLite, Swagger/OpenAPI, HTML, CSS, and JavaScript.

## Project Structure

- `backend/StudentDirectory.Api` - ASP.NET Core backend API and localhost host
- `frontend` - classic HTML/CSS/JavaScript dashboard
- `StudentDirectory.sln` - solution file
- `start.cmd` - starts the backend and opens the localhost dashboard
- `run-backend.cmd` - starts only the backend

## Technologies

- ASP.NET Core Web API
- Entity Framework Core with SQLite
- Swagger / OpenAPI
- HTML, CSS, and JavaScript localhost dashboard
- C# backend
- Git

## Requirements

Install on another Windows PC:

- .NET 8 SDK x64, only needed to build from source
- Git

## Run

Run `start.cmd`.

The API is available at `http://localhost:5000` and Swagger is at `http://localhost:5000/swagger`.

Student records are stored in the API's local `students.db` SQLite database. The API serves the frontend from the top-level `frontend` folder.
