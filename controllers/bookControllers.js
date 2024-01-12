const Book = require('../models/bookModel');
const fs = require('fs');

exports.createBook = (req, res, next) => {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject.ratings[0];
        bookObject.averageRating = 0;
        const id = req.auth.userId;
        const book = new Book({
            ...bookObject,
            userId: id,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
      
        book.save()
        .then(() =>  res.status(201).json(book))
        .catch(error => res.status(400).json({ error }))
};

exports.rateBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => {
        if(book.ratings.includes( req.auth.userId)){
           res.status(401).json('Modification de note impossible');
        } else {
            let avg = (book.averageRating+req.body.rating)/(book.ratings.length+1)
            Book.updateOne({ _id: req.params.id}, {averageRating: avg, $push: {ratings: {userId : req.auth.userId, grade : req.body.rating}}})
            .then(() => {
                Book.findOne({ _id: req.params.id })
                .then(newBook => res.status(200).json(newBook))
                .catch(error => res.status(400).json({error}));
            })
            .catch(error => res.status(401).json({error}));
        }
    })
    .catch(error => res.status(401).json({error}));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : 'unauthorized request'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json(book))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: "deleted successfully"})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.getAllBooks= (req, res, next) => {
    Book.find()
    .then( books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
};

exports.getBooksByRating = (req, res, next) => {
    Book.find()
    .then(books => {
        const booksArray = [...books];
        booksArray.sort((a, b) => b.averageRating - a.averageRating);
        if(booksArray.length>3){
            res.status(200).json(booksArray.slice(0, 3));
        }else{
            res.status(200).json(booksArray);
        }
        
    })
    .catch(error => res.status(400).json({error}));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error}));
};