// AUTH ROUTES
var express = require('express');
var passport = require('passport');
var User = require('../models/User')
var router = express.Router();
var middleware = require("../middleware"); //Automatically acquires index.js

//Root router
router.get("/", function(req, res){
	res.render("landing")
})


//Show register form
router.get('/register', function(req, res){
	res.render('register', {page:'register'});
})

//Signup logic
router.post('/register', function(req, res){
	var newUser = new User({username: req.body.username})
	if(req.body.adminCode === 'admincode123'){
		newUser.isAdmin = true;
	}
		User.register(newUser, req.body.password, function(err, user){
			if (err){
				console.log(err)
				return res.render('register', {error: err.message})
			}
			passport.authenticate('local')(req, res, function(){
				req.flash('success', 'Registered successfully! Welcome, ' + req.body.username + '.')
				res.redirect('/campgrounds');
			})
		})
	
})

//Show login form
router.get('/login', function(req, res){
	res.render('login', {page: 'login'})
})

//Login logic
router.post('/login', passport.authenticate('local', {
	//If the login works, redirects to campgrounds
	successRedirect:'/campgrounds',
	
	//If the login fails, redirects to /login again
	failureRedirect:'/login',
	failureFlash: true
}), function(req, res){
	
	
})

//LOGOUT route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Logged out!')
	res.redirect('/campgrounds')
})


module.exports = router;