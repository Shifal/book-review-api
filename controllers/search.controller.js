import Book from '../models/book.model.js';

export const searchBooks = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: 'Query param "search" is required' });
    }

    const regex = new RegExp(search, 'i');
    const results = await Book.find({
      $or: [{ title: regex }, { author: regex }]
    });

    res.json({ count: results.length, results });
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};
