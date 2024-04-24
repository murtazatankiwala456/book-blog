import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books = [];

app.get("/", (req, res) => {
  res.render("your-books.ejs", { books: books });
});

app.get("/add-book", (req, res) => {
  res.render("add-book.ejs");
});

app.post("/add-book", (req, res) => {
  const newBook = {
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
  };
  books.push(newBook);
  res.redirect("/");
});

app.get("/books/:title", (req, res) => {
  const params = _.lowerCase(req.params.title);
  books.forEach((book) => {
    const bookTitle = _.lowerCase(book.title);
    if (params === bookTitle) {
      res.render("book.ejs", { book: book });
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
