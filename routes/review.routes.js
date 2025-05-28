import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { reviewSchema } from '../validations/review.validation.js';
import {
  addReview,
  updateReview,
  deleteReview,
  getBookDetailsWithReviews
} from '../controllers/review.controller.js';

const router = express.Router();

router.get('/book/:id', getBookDetailsWithReviews);
router.post('/book/:id', auth, validate(reviewSchema), addReview);
router.put('/:id', auth, validate(reviewSchema), updateReview);
router.delete('/:id', auth, deleteReview);

export default router;
