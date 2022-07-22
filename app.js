require('dotenv').config();
const express = require('express');
const { TopologyClosedEvent } = require('mongodb');
const app = express();
const router = express.Router();
const DbConnection = require('./db/connect')
const ObjectId = require('mongodb').ObjectId;
const Tool = require('./models/Schema');
const s3Connection = require('./aws/connection')
const multer = require('multer')
const upload = multer();
const MongoDB_URI = process.env.MONGO_URI
const port = process.env.PORT || 8000


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.json());
app.use(express.static('public'))
app.use(upload.none());


// Creates a New Tool
app.post('/api/v1/tools', (req, res) => {

    const formData = req.body
    const tool = Tool.create(formData)
    res.status(201).json({ tool })
})

// Gets all Tools from DB
app.get('/api/v1/tools', (req, res) => {

    Tool.find({}, (err, found) => {
        if (err) {
            console.log("ERROR!!!")
            return res.send("no data found");
        }
        if (found) {
            res.status(200).send(found);
        }
        
    })
})



const start = async () => {
    try {
        await DbConnection(MongoDB_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`))
    }
    catch (err) {
        console.log(err);
    }
}

start();
