const mongoose = require('mongoose');

const DbConnection = (url) => {
  return mongoose.connect(url);
};
 
 module.exports = DbConnection;