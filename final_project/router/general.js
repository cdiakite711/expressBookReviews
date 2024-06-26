const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (isValid(username)) {
            return res.status(409).json({ message: 'Username already exists' });
        } else {
            users.push({ username, password });
            return res.status(201).json({ message: 'User registered successfully' });
        }
    } else {
        return res.status(400).json({ message: 'Username and password required' });
    }
});

public_users.get('/', function (req, res) {
    return res.json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) {
        return res.json(book);
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
        return res.json(filteredBooks);
    } else {
        return res.status(404).json({ message: 'No books found by this author' });
    }
});

public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
        return res.json(filteredBooks);
    } else {
        return res.status(404).json({ message: 'No books found with this title' });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) {
        return res.json(book.reviews);
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;
