
'use strict';

let mongoose = require('mongoose');
 // define course schema
let CourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Course must have a title']
  },
  description: {
    type: String,
    required: [true, 'Course must have a description']
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{
    stepNumber: Number,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

let Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
