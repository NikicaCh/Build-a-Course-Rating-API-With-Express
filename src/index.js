'use strict';
let express = require('express');
let logger = require('morgan');
let jsonParser = require('body-parser').json;
let session = require('express-session');
let bodyParser = require('body-parser');


// require mongoose models
require('./models/courses');
require('./models/reviews');
require('./models/users');

require('./database');

let app = express();

app.use(session({
  secret: "Nikica loves you",
  resave: true,
  saveUninitialized: false
}));

//Make User ID available to templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.UserId;
  next();
})

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

let courses = require('./routes/courses');
let users = require('./routes/users');

app.set('port', process.env.PORT || 5000);

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

app.use('/', express.static('public'));

app.use(jsonParser());
app.use('/api', courses);
app.use('/api', users);


// Adds a global error handler middleware function that writes error information to the response in the JSON format.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// start listening on our port
let server = app.listen(app.get('port'), function () {
  console.log('Express server is listening on port ' + server.address().port);
});
