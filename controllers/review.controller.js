import Review from '../models/review.model.js';
import Book from '../models/book.model.js';
import mongoose from 'mongoose';

export const addReview = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { rating, comment } = req.body;

    const bookExists = await Book.findById(bookId);
    if (!bookExists) return res.status(404).json({ message: 'Book not found' });

    const alreadyReviewed = await Review.findOne({ book: bookId, user: req.user.id });
    if (alreadyReviewed) return res.status(400).json({ message: 'You already reviewed this book' });

    const review = new Review({ book: bookId, user: req.user.id, rating, comment });
    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Review submission failed', error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized or review not found' });

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review', error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid review ID' });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized or review not found' });

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

export const getBookDetailsWithReviews = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const bookId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Review.countDocuments({ book: bookId });

    const avgRatingAgg = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: '$book', avgRating: { $avg: '$rating' } } }
    ]);

    const avgRating = avgRatingAgg.length ? avgRatingAgg[0].avgRating : 0;

    res.json({
      book,
      averageRating: avgRating.toFixed(2),
      totalReviews: total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      reviews
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get book details', error: err.message });
  }
};
