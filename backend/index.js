const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

var uri = "mongodb://test:test@ac-trgrc9k-shard-00-00.k173qks.mongodb.net:27017,ac-trgrc9k-shard-00-01.k173qks.mongodb.net:27017,ac-trgrc9k-shard-00-02.k173qks.mongodb.net:27017/?ssl=true&replicaSet=atlas-11jyzg-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect().then(
  () => {console.log('Connected successfully to server');
}).catch(e => {
  console.log(e);
})

app.post('/login', async (req,res) => {
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
});

app.post('/register', async (req,res) => {
    const db = client.db("GGS");
    var result = await db.collection('users').findOne({email: req.body.email});
    if(!result) {
        bcrypt.hash(req.body.password, 10).then(async (hash) => {
            await db.collection('users').insertOne({name: req.body.username, email: req.body.email, password: hash});
            res.status(200).send();
        })
    } else {
        res.status(300).send('This email is already registered');
    }
})

app.post('/allBlogs', async (req, res) => {
    user = req.body.user;
    db = client.db('GGS');
    query = {};
    if(user) {
        query['AuthorId'] = user;
    }
    const result = await db.collection('blogs').find(query).toArray();
    res.send(result);
})

app.post('/getBlog', async (req, res) => {
    id = req.body.id;
    db = client.db('GGS');
    const result = await db.collection('blogs').findOne({_id: new ObjectId(id)});
    res.json(result).send();
})
app.post('/postBlog', async (req,res) => {
    title = req.body.title;
    author = req.body.author;
    authorId = req.body.authorId;
    content = req.body.content;
    const db = client.db('GGS');
    const result = await db.collection('blogs').insertOne({Title: title, Author: author, AuthorId: authorId, Content: content});
    res.status(200).json(result).send();
})
app.post('/updateBlog', async (req, res)=> {
    id = req.body.id;
    title = req.body.title;
    author = req.body.author;
    authorId = req.body.authorId;
    content = req.body.content;
    const db = client.db('GGS');
    await db.collection('blogs').updateOne({_id: new ObjectId(id)}, {$set: {Title: title, Author: author, AuthorId: authorId, Content: content}});
    res.status(200).send();
})
app.post('/deleteBlog', async (req, res) => {
    blogId = req.body.id;
    db = client.db('GGS');
    var result = await db.collection('blogs').deleteOne({_id: new ObjectId(blogId)});
    res.send();
})

app.listen(3333, ()=> {
    console.log("server running at port 3333");
})