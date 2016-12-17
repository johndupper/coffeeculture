var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', message: req.flash() });  // add the message
});

// GET /signup
router.get('/signup', function(req, res, next) {
    res.render('signup.ejs', { message: req.flash() });
});

// POST /signup
router.post('/signup', function(req, res, next) {
    var signUpStrategy = passport.authenticate('local-signup', {
        successRedirect : '/posts',
        failureRedirect : '/signup',
        failureFlash : true
    });

    return signUpStrategy(req, res, next);
});

// GET /login
router.get('/login', function(req, res, next) {
    res.render('login.ejs', { message: req.flash() });
});

// POST /login
router.post('/login', function(req, res, next) {
    var loginProperty = passport.authenticate('local-login', {
        successRedirect : '/posts',
        failureRedirect : '/login',
        failureFlash : true
    });

    return loginProperty(req, res, next);
});

// GET /logout
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

// Restricted page
router.get('/test', function(req, res, next) {
    res.render('test.ejs', { message: req.flash() });
});

module.exports = router;