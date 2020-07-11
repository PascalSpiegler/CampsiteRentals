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

//seedDB();


//COPY THESE TO NEW APPS
//27017 is mongod's port


mongoose.connect("mongodb+srv://NTC:NTCMongo123!@cluster0.6tfbr.mongodb.net/<dbname>?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true}).then(() =>{
	console.log("Connected to MongoLab!")
}).catch(err => {
	console.log("ERROR:" , err.message)
})
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

app.listen(3000, function(){
	console.log("Campbnb server started on port 3000!");
})