const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const data = await getBooks();
    return res.status(200).json({ message: data });
    });

//Promise
const getBooks = () => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  };

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const data = await getIsbnBooks();
  const isbn = req.params.isbn
  return res.status(200).json({message: data[isbn]});
 });
  
//Promise
const getIsbnBooks = () => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  };

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const auth = req.params.author.trim().toLowerCase();

    const data = await getAuthorBooks();

    const entry = Object.entries(data).find(
      ([id, data]) => data.author.trim().toLowerCase() === auth
    );
  
    if (entry) {
      return res.status(200).json({ message: entry });
    }
    return res.status(404).json({message: "Author not found."})
});

//Promise
const getAuthorBooks = () => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  };

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const titlebook = req.params.title.trim().toLowerCase();

    const data = await getTitleBooks();

    const entry = Object.entries(data).find(
      ([id, data]) => data.title.trim().toLowerCase() === titlebook
    );
  
    if (entry) {
      return res.status(200).json({ message: entry });
    }
    return res.status(404).json({message: "Author not found."})
});

//Promise
const getTitleBooks = () => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  };

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn_param = req.params.isbn
  return res.status(200).json({message: books[isbn_param]["reviews"]});
});

module.exports.general = public_users;
