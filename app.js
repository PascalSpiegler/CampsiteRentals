console.log("Connecting...")

var express 			= require("express"),
	app					= express(),
	mongoose			= require("mongoose"),
	bodyParser 			= require("body-parser"),
	Campground 			= require("./campground"),
	Comment 			= require("./models/comment"),
	seedDB 				= require('./seeds'),
	flash				= require('connect-flash'),
	passport 			= require('passport'),
	LocalStrategy 		= require('passport-local'),
	User 				= require('./models/User'),
	methodOverride = require('method-override')

var commentRoutes 		= require('./routes/comments'),
	campgroundRoutes 	= require('./routes/campgrounds'),
	indexRoutes 		= require('./routes/index')


mongoose.connect(process.env.DATABASEURL, {useNewUrlParser:true, useUnifiedTopology:true})


app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "NoteTakingClub!",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	//Adds the current user variable to all ejs files
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
	
})

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Campbnb server started on port 3000!");
})

