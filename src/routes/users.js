'use strict';
let express = require('express');
let router = express.Router();
let User = require('../models/users');
let mid = require('../middleware');

router.get('/users',mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.UserId)
  .exec( (error, user) => {
    if(error) {
      next(error);
    } else {
      res.json(user);
    }
  })  
});


router.post('/users', (req, res, next) => {
  if(
    req.body.fullName && 
    req.body.emailAddress && 
    req.body.password &&
    req.body.confirmPassword
  ){
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }
    User.find({emailAddress: req.body.emailAddress})
    .exec((err, users) => {
      if(err) {
        next(err);
      } else {
        if(!users.length) {
          User.create(req.body, function(err) {
            if (err) {
              return next(err);
            } else {
              User.authenticate(req.body.emailAddress, req.body.password, (error, user) => {
                if( error || !user) {
                  let err = new Error('Wrong email or password');
                  err.status = 401;
                  return next(err);
                } else {
                  req.session.UserId = user._id;
                  return res.status(201)
                  .location('/')
                  .end();	
                }
              });
            }
          });  
        } else {
          let err = new Error("email address already used");
          err.status = 409;
          next(err);
        }
      }
    })
  } else {
    let err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
