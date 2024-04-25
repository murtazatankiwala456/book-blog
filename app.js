import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import axios from "axios";

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
app.get("/search-book", (req,res) =>{
  res.render("search-book.ejs")
});

app.post("/search-book",async (req,res) =>{
  const topic =req.body.topic;
  try{
  const response = await axios.get(`https://gutendex.com/books/`, {params:{topic:topic}});
  const book = response.data;
  console.log(book.results[0].title);
  console.log(book.results[0].authors[0].name);
  res.render("search-book.ejs", {book:book})
  }catch(error){
    console.log(error.message)
    res.render("search-book.ejs", {error:"Sorry! Book not available for this topic"})
  }
  
  
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
