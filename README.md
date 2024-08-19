Book Catalogue Web Application

A full-stack web application that allows users to create and manage a personal book catalog. The app integrates with the Open Library API to 
fetch book details and cover images, storing user entries,ratings, and notes in a PostgreSQL database. The frontend is designed to be responsive and user-friendly.

Features
- Search for books by ISBN and automatically fetch details from the Open Library API.
- Add, edit, and delete book entries with user ratings and notes.
- View a list of all books in the catalog with detailed information.
- Responsive design for optimal viewing on different devices.


Ensure PostgreSQL is installed on your system. During installation, you may be prompted to
set a password for the PostgreSQL superuser (postgres). Make sure to remember this password.

pgAdmin is often included with PostgreSQL. It provides a graphical interface for managing 
your databases. If you prefer using a GUI, ensure pgAdmin is installed.

Open pgAdmin and create a new database.
Use the SQL query provided in queries.sql to create the necessary tables within your newly created database.

In the index.js file of this project, enter the database name and password you set during the PostgreSQL installation.

In your terminal, navigate to the project directory and run the following command to start the application locally:

nodemon index.js

