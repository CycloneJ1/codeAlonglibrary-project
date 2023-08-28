const express = require('express');
const Book = require('../models/book.model');
const router = express.Router();


router.get("/contact-me", () => {})


/* GET home page */
router.get("/books", (req, res, next) => {

    Book.find()
        .then((booksFromDB) => {
            console.log(booksFromDB)

            res.render("books/books-list", {books: booksFromDB})
        })
        .catch( e => {
            
            console.log("error getting the list of books from the DB");
            next(e)
        })

  //res.render("index");
});

// display from

router.get("/books/create", (req, res, next) => {

    res.render("books/book-create")

})

//proccess from

router.post("/books/create", (req, res, next) => {

    const newBook = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        rating: req.body.rating

    }
    Book.create(newBook)
    .then(() => {
        console.log(newBook)
        res.redirect("/books")
    })
    .catch(e => {
        console.log("error creating new book", e)
        next(e)
    })
})


router.get('/books/:bookId/edit', (req, res, next) => {
    const { bookId } = req.params;
   
    Book.findById(bookId)
      .then(bookToEdit => {
       res.render('books/book-edit', { book: bookToEdit})
      })
      .catch(error => next(error));
  });



  router.post('/books/:bookId/edit', (req, res, next) => {
    const { bookId } = req.params;
    const { title, description, author, rating } = req.body;
   
    Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
      .then(updatedBook => res.redirect(`/books/${updatedBook.id}`))
      .catch(error => next(error));
  });



  router.post('/books/:bookId/delete', (req, res, next) => {
    const { bookId } = req.params;
   
    Book.findByIdAndDelete(bookId)
      .then(() => res.redirect('/books'))
      .catch(error => next(error));
  });


router.get("/books/:bookId", (req, res, next) => {
    
    const id = req.params.bookId
    
    Book.findById(id)
    .then(bookFromDB => {

        res.render("books/book-details", bookFromDB), 
        console.log(bookFromDB)
        //res.send(`Hola ${id}`)

    })
    .catch( e => {
            
        console.log("error getting the list of books from the DB");
        next(e)
    })
    
})




module.exports = router;