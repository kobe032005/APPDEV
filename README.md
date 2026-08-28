# Student Records System

This is a browser-based student records system built using plain HTML, CSS, and JavaScript.

## Features
- Add students with a unique student ID, full name, email, phone, course name, course code, year level, section, enrollment date, status, and address.
- Read and display students in a directory table.
- Update existing students using the edit button.
- Delete students with confirmation.
- Input validation prevents incomplete fields and duplicate student IDs.
- Student records persist in browser `localStorage`.

## Files
- `index.html`: Student directory structure and input form.
- `styles.css`: Styling for the form, table, and layout.
- `script.js`: Student CRUD logic and persistence.

## Running
Open `index.html` in any modern browser to use the app.

## Notes
The application stores data locally in the browser and does not use a backend database. Records remain available after refreshing the page on the same device and browser.
