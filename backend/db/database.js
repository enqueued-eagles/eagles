//creates database to store data
//tables and related data will be under this database name;

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var learndb = mongoose.connection;
learndb.on('error', console.error.bind(console, 'db:line7:Kai needs to fix something probably'));
learndb.once('open', function() {
  console.log('Nice job connecting to the server Kai');
})
mongoose.connect('mongodb://paul:123@ds129651.mlab.com:29651/learning-lessons');

module.exports = learndb;