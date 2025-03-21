import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import multer from "multer";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Multer file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Folder to save the uploaded images;
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Timestamp to avoid name conflicts
  },
});

const upload = multer({ storage: storage });

// PostgreSQL connection
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

// API for fetching book cover
async function getBookCover(isbn) {
  try {
    const response = await axios.get(
      `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
    );
    return response.config.url;
  } catch (error) {
    console.error("Error fetching the cover image:", error);
    return null;
  }
}

// Express routes
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

// Post request to handle form submission
app.post("/add", upload.single("image"), async (req, res) => {
  const { title, author, description, date_read, rating, isbn, notes } =
    req.body;
  let cover_url = "";

  // Check if an image was uploaded
  if (req.file) {
    // Use the uploaded image's file path
    cover_url = `/images/${req.file.filename}`;
  } else {
    // If no image was uploaded, fetch the cover using the ISBN
    try {
      cover_url = await getBookCover(isbn);
    } catch (error) {
      console.error("Error fetching book cover:", error);
      // Optionally, set a default cover URL in case of an error
      cover_url = "/images/default_cover.jpg";
    }
  }

  try {
    await db.query(
      "INSERT INTO books (title, author, description, date_read, rating, isbn, notes, cover_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [title, author, description, date_read, rating, isbn, notes, cover_url]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Database query error: ", err);
    res.status(500).send("Error adding the book");
  }
});

app.get("/edit/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);

    if (result.rows.length > 0) {
      res.render("edit.ejs", { book: result.rows[0] });
    } else {
      res.status(404).send("Book not found");
    }
  } catch (err) {
    console.error("Database query error: ", err);
    res.status(500).send("Error retrieving book details");
  }
});

app.post("/edit/:id", upload.single("image"), async (req, res) => {
  const bookId = req.params.id; // Get book ID from URL
  const {
    title,
    author,
    description,
    date_read,
    rating,
    isbn,
    notes,
    cover_url,
  } = req.body;
  const image = req.file;

  const cover_url_to_use = image
    ? `/images/${image.filename}`
    : cover_url || "";

  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, description = $3, date_read = $4, rating = $5, isbn = $6, notes = $7, cover_url = $8 WHERE id = $9",
      [
        title,
        author,
        description,
        date_read,
        rating,
        isbn,
        notes,
        cover_url_to_use,
        bookId,
      ]
    );

    res.redirect(`/book/${bookId}`); // Redirect to updated book page
  } catch (err) {
    console.error("Database query error: ", err);
    res.status(500).send("Error updating the book");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
