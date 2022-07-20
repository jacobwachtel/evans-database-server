const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const Db = process.env.MONGO_URI

var _db;

mongoose.connect(
    Db,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
   
  const connectDB = {
    connectToServer: function (callback) {
      client.connect(function (err, db) {
        // Verify we got a good "db" object
        if (db)
        {
          _db = db.db("evans-db");
          console.log("Successfully connected to MongoDB."); 
        }
        return callback(err);
           });
    },
   
    getDb: function () {
      return _db;
    },
  };
 
 module.exports = connectDB;