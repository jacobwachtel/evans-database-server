const mongoose = require('mongoose');

const DbConnection = (url) => {
  return mongoose.connect(url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
};
 
 module.exports = DbConnection;