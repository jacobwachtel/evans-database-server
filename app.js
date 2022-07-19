require('dotenv').config();
const express = require('express');
const { TopologyClosedEvent } = require('mongodb');
const app = express();
const router = express.Router();
const connectDB = require('./db/connect')
const ObjectId = require('mongodb').ObjectId;
const Tool = require('./models/Schema')


// app.use(express.static('./public'));
app.use(express.json());


// const errorCatcher = (inputError) => {
//     console.log(inputError);
//     res.status(500);
//     res.json({ status: 500, error: inputError })
// }

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//  });

app.get('/api/v1/tools', (req, res) => {
//    let db_connect = connectDB.getDb('evans-db');
//    db_connect
//    .collection('tools')
//    .find({})
//    .toArray((err, result) => {
//     if(err) throw err;
//     res.json(result);
//    })
    Tool.find({}, (err, found) => {
        if (!err) {

            res.send(found);
        }
        console.log(err);
        res.send("Some error occurred!");
    })
})

app.listen(3000, () => {
    console.log('listening on Port 3000');
})


// const tasks = Task.find({});
// collection.find()
//     .toArray()
//     .then((docs) => res.json(docs))
//     .catch((err) => errorCatcher(err))

// res.status(200).json({ message: 'GET request to homepage'});