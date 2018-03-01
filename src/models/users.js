
'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

//define user schema
let UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required']
  },
  password: {
    type: String,
    required: true
  }
});
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ emailAddress: email})
    .exec( (error, user) => {
      if(error) {
        callback(error);
      } else if ( !user) {
        let err = new Error('User not found');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if(result == true) {
          return callback(null, user)
        } else {
          return callback()
        }
      })
    });
}

// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

let User = mongoose.model('User', UserSchema);
module.exports = User;
