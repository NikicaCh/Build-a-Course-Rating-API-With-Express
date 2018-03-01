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
      res.render('user', {user: user});
    }
  })  
});

router.get('/register', mid.loggedOut, (req, res) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  if(
    req.body.name && 
    req.body.email && 
    req.body.password &&
    req.body.confirmPassword
  ){
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    // create object with form input
    let userData = {
      fullName: req.body.name,
      emailAddress: req.body.email,
      password: req.body.password
    };

    // use schema's `create` method to insert document into Mongo
    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.UserId = user._id;
        return res.redirect('/');
      }
    });
  } else {
    let err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

router.get('/login', mid.loggedOut, (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  if(req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if( error || !user) {
        let err = new Error('Wrong email or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.UserId = user._id;
        return res.redirect('/api/users')
      }
    });
  } else {
    let err = new Error('Email and password are required');
    err.status = 401;
    return next(err);
  }
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy( (err) => {
      if(err) {
        next(err);
      } else {
        res.redirect('/');
      }
    });
  }
  
});

module.exports = router;
