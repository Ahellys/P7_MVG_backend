const express = require('express');
const booksCtrl = require('../controllers/bookControllers');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');


const router = express.Router(); 



router.post('/', auth, multer, booksCtrl.createBook);

router.post('/:id/rating', auth, booksCtrl.rateBook);

router.put('/:id', auth, multer, booksCtrl.modifyBook);

router.delete('/:id', auth, booksCtrl.deleteBook);

router.get('/', booksCtrl.getAllBooks);

router.get('/bestrating', booksCtrl.getBooksByRating);

router.get('/:id', booksCtrl.getOneBook);



module.exports = router;