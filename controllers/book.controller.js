import Book from '../models/book.model.js';

export const createBook = async (req, res) => {
  try {
    const payload = req.body;

    // Normalize to array for unified handling
    const books = Array.isArray(payload) ? payload : [payload];

    // Add user info to each book
    const booksToSave = books.map(book => ({
      ...book,
      createdBy: req.user.id,
    }));

    // Save books (single or multiple)
    const result = await (booksToSave.length > 1
      ? Book.insertMany(booksToSave)
      : new Book(booksToSave[0]).save());

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to add book(s)',
      error: err.message,
    });
  }
};


export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const query = {};

    if (author) query.author = new RegExp(author, 'i');
    if (genre) query.genre = new RegExp(genre, 'i');

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: books
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
};
