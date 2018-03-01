'use strict';
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/BuildARESTAPI');
let db = mongoose.connection;
db.on('error', function (err) {
  console.error('Connection error:', err);
});
db.once('open', function () {
  require('./seed');
  console.log('Db Connected');
});
