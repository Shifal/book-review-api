# Book Review API

A RESTful API to manage books and reviews built with Node.js, Express, MongoDB, and JWT authentication.

---

## Features

- User signup and login with JWT authentication
- Add and list books with pagination and filters (author, genre)
- View book details including average rating and paginated reviews
- Submit, update, and delete reviews (one review per user per book)
- Search books by title or author (case-insensitive)
- Protected routes for authenticated users

---

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for request validation
- dotenv for environment variable management

---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/book-review-api.git
   cd book-review-api

2. **Install dependencies:**
    npm install

3. **Create a .env file in the root directory with the following variables:**
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/book_review_api
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=1d

4. **Start the server:**
    npm run dev


**API Endpoints:**

Method	            Endpoint	            Description	Auth Required
POST	         /api/auth/signup	        Register a new user	No
POST	        /api/auth/login	            Login and get JWT token	No
POST	        /api/books	                Add a new book	Yes
GET	            /api/books	                List all books (supports filters & pagination)	No
GET	            /api/books/:id	            Get details of a book (includes avg rating & reviews)	No
POST	        /api/books/:id/reviews	    Add a review for a book	Yes
PUT	            /api/reviews/:id	        Update your review	Yes
DELETE	        /api/reviews/:id	        Delete your review	Yes
GET	            /api/search?search=term	    Search books by title or author	No


Notes  : 

. Use the JWT token received on login in the Authorization header as Bearer <token> to access protected routes.
. Pagination query parameters: page (default 1), limit (default 10).
. Users can only submit one review per book.
. Reviews include rating (number) and comment (string).


