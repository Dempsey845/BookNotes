import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// PostgreSQL
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "password",
  port: 5432,
});

db.connect();

async function getAllBooks() {
  try {
    const result = await db.query("SELECT * FROM books");
    return result.rows;
  } catch (err) {
    console.error("Database query error: ", err);
  }
}

async function getBookWithID(id) {
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    return result.rows;
  } catch (err) {
    console.error("Database query error: ", err);
  }
}

// API
async function getBookCover(isbn) {
  try {
    const response = await axios.get(
      `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
    );
    return response.config.url; // This will return the image URL
  } catch (error) {
    console.error("Error fetching the cover image:", error);
    return null; // Return null or a default image URL if the request fails
  }
}

// Express
app.get("/", async (req, res) => {
  const books = await getAllBooks();
  res.render("index.ejs", { books: books });
});

app.get("/add", async (req, res) => {
  res.render("add.ejs");
});

app.get("/book/:id", async (req, res) => {
  const bookId = req.params.id;
  const book = await getBookWithID(bookId);
  console.log(book);
  res.render("book.ejs", { book: book[0] });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
