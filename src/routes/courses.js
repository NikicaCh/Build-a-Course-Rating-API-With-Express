'use strict';
let express = require('express');
let router = express.Router();
let Course = require('../models/courses');
let User = require('../models/users');
let Review = require('../models/reviews');
let mid = require('../middleware');


// GET all courses
router.get('/courses', (req, res, next) => {
    Course.find({}, '_id title')
    .exec((err, courses) => {
        if(err) {
            next(err);
        } else {
            res.json(courses);
        }
    }); 
});

// GET specific course by Id
router.get('/courses/:id', (req, res, next) => {
    Course.findById(req.params.id)
		.exec( (err, course) => {
            if (err) return next(err);
            else {
                res.json(course);
            }  
		});
});

// POST / Create a new Course
router.post('/courses', mid.requiresLogin, function(req, res, next) {
    if(
        req.body.title && 
        req.body.description && 
        req.body.steps
      ){
        Course.create(req.body, (err) => {
            if (err) {
                next(err);
            } else {
                return res.status(201).location('/').end();
            }
        });
      }else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
	
});

// POST /Create a review
router.post('/courses/:id/reviews', (req, res, next) => {
    if( req.body.review && 
        req.body.rating
    ) {
        Course.findById(req.params.id)
            .populate('user')
		    .populate('reviews')
            .exec((err, course) => {
                if(err) {
                    next(err);
                } else {
                    if(course.user === req.session.UserId ) {
                        let err = new Error("You can't review your own course");
                        err.status = 409;
                        next(err);
                    } else {
                        if(req.session.UserId) {
                            let review = new Review(req.body);
                            review.user = req.session.UserId;
                            course.reviews.push(review);
                            course.save((err) => {
                                if(err) {
                                    next(err);
                                }
                            });
                            review.save((err) => {
                                if(err) { 
                                    next(err);
                                } 
                            });
                            res.status(201).location('/courses/' + req.params.id).end();
                        } else {
                            let err = new Error("You must be logged in to review a course");
                            err.status = 401;
                            next(err);
                        }
                    }
                }
        });
    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);s
    }
});

// PUT Edit a course
router.put('/courses/:id', (req, res, next) => {
    if (req.body.user._id === req.session.UserId) {
        Course.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, course) => {
            if(err) {
                next(err);
            } else {
                res.json(course);
            }
        })
    } else {
        let err = new Error("You can't edit someone else's courses");
        err.status = 401;
        next(err);
    }
    
});

module.exports = router;
