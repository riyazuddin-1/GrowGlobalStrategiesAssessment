const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const routes = require("./routes");
const configs = require("./config.json");

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

// Setting up routes
app.use("/", routes);

app.listen(configs.PORT, ()=> {
    console.log(`server running at port ${configs.PORT}`);
})