# Book Notes App

This is a simple web application designed for personal use to keep track of books read, including notes, ratings, and short descriptions. The app allows users to store book details and optionally upload a book cover image. It was built as a hobby and practice project to improve my skills with Express, PostgreSQL, and Multer.

## Features
- Add, view, and store book details such as title, author, ISBN, and notes.
- Upload a custom cover image for each book.
- View books with their associated details and cover image.
- Store the data in a PostgreSQL database.

## Technologies Used
- **Express.js**: Web framework for Node.js
- **PostgreSQL**: Relational database to store book details
- **Multer**: Middleware to handle file uploads (cover images)
- **EJS**: Template engine for rendering HTML views
- **Axios**: For fetching book cover images from Open Library if no custom cover is provided

## Prerequisites

- Node.js installed on your machine.
- PostgreSQL database set up and running.

## Installation

Follow these steps to get the project up and running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/book-notes-app.git
cd book-notes-app
```

### 2. Install Dependencies

Run the following command to install the required Node.js packages:

```bash
npm install
```

This will install all the necessary packages listed in `package.json`, including `express`, `pg`, `multer`, `axios`, and `body-parser`.

### 3. Set Up PostgreSQL Database

1. **Create a new PostgreSQL database** for the project:

```bash
psql -U postgres
CREATE DATABASE booknotes;
```

2. **Create the books table**. Copy and run the following SQL query to create a `books` table where book details will be stored:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  description TEXT,
  date_read DATE,
  rating INTEGER,
  isbn VARCHAR(13),
  notes TEXT,
  cover_url VARCHAR(255)
);
```

3. **Configure your PostgreSQL connection** in the `app.js` (or wherever the database connection is set up) file to use your PostgreSQL credentials.

Example:

```javascript
const db = new pg.Client({
  user: "postgres",    // replace with your PostgreSQL username
  host: "localhost",
  database: "booknotes", // use the database you created
  password: "password",  // replace with your PostgreSQL password
  port: 5432,
});

db.connect();
```

### 4. Start the Server

Once the dependencies are installed and the database is set up, you can start the server by running:

```bash
npm start
```

The app should now be running on `http://localhost:3000`.

## Usage

- Visit the home page to view the list of books.
- Click the "Add Book" button to add a new book to the list.
- Add details such as the book title, author, rating, ISBN, and notes. You can also upload a book cover image.
- After adding the book, it will be displayed on the homepage along with its details and cover image.

## Contributing

This is a personal project meant for learning purposes, and I do not currently accept contributions. However, feel free to fork the repository and modify it to suit your needs.
