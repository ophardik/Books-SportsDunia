const express=require("express");
const { addBook, allBooks, specificBook, updateBookInfo, deleteBook } = require("../Controllers/bookController");
const router=express.Router();

router.post("/books",addBook)
router.get("/books",allBooks)
router.get('/books/:id', specificBook);
router.put('/books/:id', updateBookInfo);
router.delete('/books/:id', deleteBook);

module.exports=router;