'use strict';
let seeder = require('mongoose-seeder');
let data = require('./data/data.json');
seeder.seed(data, {dropDatabase: false}).then(function (dbData) {
  console.log('Database seeded');
}).catch(function (err) {
  if (err) {
    console.log(err);
  }
});
