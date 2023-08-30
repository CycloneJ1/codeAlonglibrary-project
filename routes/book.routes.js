const express = require('express');
const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

const router = express.Router();

// READ: display all books
router.get("/books", (req, res, next) => {
    Book.find()
        .populate("author")
        .then((booksFromDB) => {

            const data = {
                books: booksFromDB
            }

            res.render("books/books-list", data);
        })
        .catch((e) => {
            console.log("Error getting list of books from DB", e);
            next(e);
        })
})



// CREATE: display form
router.get("/books/create", (req, res, next) => {
    Author.find()
        .then( authorsFromDB => {
            const data = {
                authors: authorsFromDB
            }
            res.render("books/book-create", data);
        })
        .catch((e) => {
            console.log("Error getting list of authors from DB", e);
            next(e);
        });
});



// CREATE: process form
router.post("/books/create", (req, res, next) => {

    const newBook = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        rating: req.body.rating
    };

    Book.create(newBook)
        .then((newBook) => {
            res.redirect("/books");
        })
        .catch(e => {
            console.log("error creating new book", e);
            next(e);
        });
});



// UPDATE: display form
router.get('/books/:bookId/edit', async (req, res, next) => {
    const { bookId } = req.params;

    try {
        const bookDetails = await Book.findById(bookId);
        const authors = await Author.find();

        const data = { 
            book: bookDetails, 
            authors: authors 
        }

        res.render('books/book-edit.hbs', data)
    } catch(error){
        next(error)
    }
});



// UPDATE: process form
router.post('/books/:bookId/edit', (req, res, next) => {
    const { bookId } = req.params;
    const { title, description, author, rating } = req.body;

    Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
        .then(updatedBook => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
        .catch(error => next(error));
});



// DELETE: delete book
router.post('/books/:bookId/delete', (req, res, next) => {
    const { bookId } = req.params;

    Book.findByIdAndDelete(bookId)
        .then(() => res.redirect('/books'))
        .catch(error => next(error));
});



// READ: display details of one book
router.get("/books/:bookId", (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
        .populate("author")
        .then(bookFromDB => {
            res.render("books/book-details", bookFromDB);
        })
        .catch((e) => {
            console.log("Error getting book details from DB", e);
            next(e);
        })

})


module.exports = router;
