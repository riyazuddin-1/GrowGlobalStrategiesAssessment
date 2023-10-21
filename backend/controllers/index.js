const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const configs = require("./config.json");

// Connecting to database
const uri = configs.mongoDB_uri;
const client = new MongoClient(uri);
client.connect().then(
  () => {console.log('Connected successfully to server');
}).catch(e => {
  console.log(e);
})

// --------------------------------------
// Authentication handling
// Login handler
async function login(req, res) {
    const db = client.db('GGS');
    const result = await db.collection('users').findOne({email: req.body.email});
    if(result) {
        bcrypt.compare(req.body.password, result.password).then((matched) => {
            if(matched) {
                res.json(result).send();
            } else {
                res.status(300).send('Password is incorrect');
            }
        })
    } else {
        res.status(300).send('The email is not registered');
    }
}

// Registration handler
async function register(req,res) {
    const db = client.db("GGS");
    const result = await db.collection('users').findOne({email: req.body.email});
    if(!result) {
        bcrypt.hash(req.body.password, 10).then(async (hash) => {
            await db.collection('users').insertOne({name: req.body.username, email: req.body.email, password: hash});
            res.status(200).send();
        })
    } else {
        res.status(300).send('This email is already registered');
    }
}

// ----------------------------------------
// Getting all the blogs
async function getBlogs(req, res) {
    user = req.body.user;
    db = client.db('GGS');
    query = {};
    if(user) {
        query['AuthorId'] = user;
    }
    const result = await db.collection('blogs').find(query).toArray();
    res.send(result);
}

// ----------------------------------------
// CRUD operations on Blogs

// Create
async function createBlog(req,res) {
    title = req.body.title;
    author = req.body.author;
    authorId = req.body.authorId;
    content = req.body.content;
    const db = client.db('GGS');
    const result = await db.collection('blogs').insertOne({Title: title, Author: author, AuthorId: authorId, Content: content});
    res.status(200).json(result).send();
}

// Read
async function getBlog(req, res) {
    id = req.body.id;
    db = client.db('GGS');
    const result = await db.collection('blogs').findOne({_id: new ObjectId(id)});
    res.json(result).send();
}

// Update
async function updateBlog(req, res) {
    id = req.body.id;
    title = req.body.title;
    author = req.body.author;
    authorId = req.body.authorId;
    content = req.body.content;
    const db = client.db('GGS');
    await db.collection('blogs').updateOne({_id: new ObjectId(id)}, {$set: {Title: title, Author: author, AuthorId: authorId, Content: content}});
    res.status(200).send();
}

// Delete
async function deleteBlog(req, res) {
    blogId = req.body.id;
    db = client.db('GGS');
    await db.collection('blogs').deleteOne({_id: new ObjectId(blogId)});
    res.send();
}

module.exports = {login, register, getBlogs, createBlog, getBlog, updateBlog, deleteBlog };