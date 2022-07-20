require('dotenv').config();
const express = require('express');
const { TopologyClosedEvent } = require('mongodb');
const app = express();
const router = express.Router();
const connectDB = require('./db/connect')
const ObjectId = require('mongodb').ObjectId;
const Tool = require('./models/Schema')


app.use(express.json());

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

app.listen(3000, () => {
    console.log('listening on Port 3000');
})
