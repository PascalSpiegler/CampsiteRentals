var express = require("express");
var router  = express.Router();
var Campground = require("../campground");
var middleware = require("../middleware") //Automatically acquires index.js

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
		   req.flash('error', 'Something went wrong')
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
	var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price:price, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
			req.flash('error', 'Something went wrong')
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
			req.flash('success', 'Campground created!')
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
			req.flash('error', 'Something went wrong')
        } else {
			if(!foundCampground){
				req.flash('error', 'Item not found');
				return res.redirect('back');
			}
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})
 
//EDIT campground route

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	//Check if user is logged in
	//Renders the edit page for the appropriate campground
	Campground.findById(req.params.id, function(err, foundCampground){
		//.author.id is an object, but req.user._id is a strong
		//Check if the id of the logged in user is equal to the id of who posted the campground:
		if(!foundCampground){
				req.flash('error', 'Item not found');
				return res.redirect('back');
			}
		res.render('campgrounds/edit', {campground: foundCampground})
	})
})

//UPDATE campground route

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
		//Find and update correct campground
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
			if(!updatedCampground){
				req.flash('error', 'Item not found');
				return res.redirect('back');
			}
			if(err){
				req.flash('error', 'Something went wrong')
				res.redirect('/campgrounds')
			} else {
				req.flash('success', 'Updated campground!')
				res.redirect('/campgrounds/' + req.params.id);
			}
	})
})

// DESTROY route

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash('error', 'Something went wrong')
			res.redirect('/campgrounds')
		} else {
			req.flash('success', 'Deleted campground!')
			res.redirect('/campgrounds')
		}
	})
})



module.exports = router