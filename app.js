import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import axios from "axios";
import mongoose from "mongoose";
import 'dotenv/config'

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.mongodb_URI);

const bookSchema = {
  title: String,
  review: String,
  author: String
}
const Book = mongoose.model("Book", bookSchema)


app.get("/", async (req, res) => {

  try{
 const findBooks = await Book.find({});
 console.log(findBooks)
 res.render("your-books.ejs", { books: findBooks });
  }catch(error){
    console.error("Error fetching items:", error);
    res.send("Internal Server Error");

  }
 
});

app.get("/add-book", (req, res) => {
  res.render("add-book.ejs");
});

app.post("/add-book", (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    review: req.body.review,
    author: req.body.author,
  });
    
  
  newBook.save();
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

app.get("/books/:id", async (req, res) => {
  try {
    const requestBookId = req.params.id;
    const foundBook = await Book.findById({_id: requestBookId})
     res.render("book.ejs", {book:foundBook})

  
  } catch (error) {
    console.error("Error fetching items:", error);
    res.send("Internal Server Error");
  }
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
