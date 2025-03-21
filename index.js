import express from "express";
import bodyParser from "body-parser";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.get("/book/1", (req, res) => {
  res.render("book.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
