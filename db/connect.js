const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const Db = process.env.MONGO_URI


mongoose.connect(
    Db,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

  var _db;

// const APIConnection = "mongodb+srv://jacobwachtel:Wookiewookie1@evans-db-cluster.3dayq.mongodb.net/?retryWrites=true&w=majority"


// const connectDB = (APIConnection) => {
//     return mongoose.connect(APIConnection, {
//        useNewUrlParser: true,
//        useCreateIndex: true,
//        useFindAndModify: false,
//        useUnifiedTopology: true,
//     });
//  };
 
   
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