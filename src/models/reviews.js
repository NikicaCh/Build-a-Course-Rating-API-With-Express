'use strict';

let mongoose = require('mongoose');

// define review schema
let ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: [true, 'Please Enter a Rating'],
    min: 1,
    max: 5,
    default: 3,
    integer: 'Value must be an integer.'
  },
  review: String
});

let Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
