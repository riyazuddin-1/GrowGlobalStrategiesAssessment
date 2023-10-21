const express = require('express');
const app = express();
const controllers = require('../controllers');

// Authentication
app.post('/login', controllers.login);

app.post('/register', controllers.register);

// Getting all blogs
app.post('/allBlogs', controllers.getBlogs);

// Blogs CRUD
app.post('/getBlog', controllers.getBlog);

app.post('/postBlog', controllers.createBlog);

app.post('/updateBlog', controllers.updateBlog);

app.post('/deleteBlog', controllers.deleteBlog);

module.exports = app;