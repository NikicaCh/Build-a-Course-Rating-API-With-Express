'use strict';
let express = require('express');
let router = express.Router();
let Course = require('../models/courses');
let User = require('../models/users');
let Review = require('../models/reviews');
let mid = require('../middleware');


// GET all courses
router.get('/courses', mid.requiresLogin, (req, res, next) => {
    Course.find()
    .exec((err, courses) => {
        if(err) {
            next(err);
        } else {
            res.render('courses', {courses: courses});
        }
    }); 
});

// GET specific course by Id
router.get('/course/:id', mid.requiresLogin, (req, res, next) => {
    let id = req.params.id;
    Course.findById(id)
    .exec((err, course) => {
        if(err) {
            next(err);
        } else {
            let reviews = course.reviews;
            User.findById(course.user)
            .exec((err, user) => {
                if(err) {
                    next(err);
                } else {
                    Review.find({
                        '_id': { $in: reviews }
                    })
                    .exec((err, review) => {
                        if(err) {
                            next(err);
                        } else {
                            res.render('course-details', {course: course, user: user, reviews: review, counter: course.steps.length});
                        }
                    });
                    
                }
            });
            
        }
    });
});

// GET new course form 
router.get('/new_course', (req, res, next) => {
    res.render('new_course');
});

// POST / Create a new Course
router.post('/course', (req, res, next) => {
    if(
        req.body.title &&
        req.body.description &&
        req.body.estimatedTime &&
        req.body.materialsNeeded
    ) { 
        let steps = [];
        for(let i=1; i <= req.body.stepTitle.length; i++){
            steps.push({
                stepNumber: i,
                title: req.body.stepTitle[i-1] ,
                description: req.body.stepDescription[i-1]
            });
        }
        let CourseData = {
            user: req.session.UserId ,
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
            steps: steps
        }
        Course.create(CourseData, (err, course) => {
            if(err) {
                next(err);
            } else {
                res.redirect('/api/courses');
            }
        })
    } else {
        let err = new Error("All fields are required");
        err.status = 400;
        next(err);
    }
});

router.post('/course/:id', (req, res, next) => {
    let steps = [];
        for(let i=1; i <= req.body.stepTitle.length; i++){
            steps.push({
                stepNumber: i,
                title: req.body.stepTitle[i-1] ,
                description: req.body.stepDescription[i-1]
            });
    }
    Course.findByIdAndUpdate(req.params.id,
         {$set:{
            title: req.body.title,
            description: req.body.description, 
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
            steps: steps
            }}, (err, course) => {
        if(err){
            next(err);
        } else {
            res.redirect('/api/course/'+ req.params.id);
        }
    })
});

// POST /Create a review
router.post('/review/:id', (req, res, next) => {
    if( 
        req.body.review &&
        req.body.rating
    ) {
        User.findById(req.session.UserId)
        .exec((err, user) => {
            if(err) {
                next(err);
            } else {
                let reviewData = {
                    reviewer: user.fullName,
                    rating: req.body.rating,
                    review: req.body.review
                }
                Review.create(reviewData, (err, review) => {
                    if(err) {
                        next(err);
                    } else {
                        Course.findByIdAndUpdate(req.params.id, {$push: {reviews: review}}, (err, course) => {
                            if(err) {
                                next(err);
                            } else {
                                course.reviews.push(review.id);
                            }
                            });
                            res.redirect('/api/course/' + req.params.id);
                    }
                })
            }
        })            
    } else {
        let err = new Error('All fields are required');
        err.status = 400;
        next(err);
    }
});


module.exports = router;
