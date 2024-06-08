const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });
        req.session.authorization = { accessToken };
        return res.status(200).json({ message: "User logged in successfully" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.data;

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.data;

    if (books[isbn]) {
        const reviews = books[isbn].reviews;

        if (reviews[username]) {
            delete reviews[username];
            res.status(200).json({ message: "Review deleted successfully" });
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
