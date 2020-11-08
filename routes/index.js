var express = require('express');
var router = express.Router();

/* GET information of the currently logged-in user */
router.get('/', function(req, res, next) {
  res.end('Hoi!');
});

/* POST create new session */
router.post('/auth', function(req, res, next) {
  // Verify input
  // Check if we have a user with the presented email address
  // Check if the password matches
  // Return user information

  let userData = {
    "name": "Bram Pelgrom"
  }

  res.status(200)
    .type('application/json')
    .send(userData);

});

/* GET information of the currently logged-in user */
router.post('/users', function(req, res, next) {
  // Verify input
  // Check if we have a user with the presented email address
  // Check if the password matches
  // Return user information

  let userData = {
    "name": "Bram Pelgrom"
  }

  res.status(200)
    .type('application/json')
    .send(userData);
    
});

/* GET information of the currently logged-in user */
router.get('/me', function(req, res, next) {
  
});

/* GET the calendar for the currently logged-in user */
router.get('/me/calendar', function(req, res, next) {
  
});


module.exports = router;