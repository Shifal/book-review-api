import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createBookSchema } from '../validations/book.validation.js';
import { createBook, getBooks, getBookById } from '../controllers/book.controller.js';

const router = express.Router();

router.post('/', auth, validate(createBookSchema), createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);

export default router;
