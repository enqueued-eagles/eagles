//creates database to store data
//tables and related data will be under this database name;

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var learndb = mongoose.connection;
learndb.on('error', console.error.bind(console, 'database error'));
learndb.once('open', function() {
  console.log('Database connected!');
})
mongoose.connect(process.env.DB_CONNECTION);

module.exports = learndb;