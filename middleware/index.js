//All middleware goes here

var middlewareObj = {};
var Campground = require('../campground')
var Comment = require('../models/comment')

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		//Renders the edit page for the appropriate campground
		Campground.findById(req.params.id, function(err, foundCampground){
			if (err){
				req.flash('error', 'Campground not found!')
				res.redirect('back')
			} else {
				
				if (!foundCampground){
					req.flash('error', 'Item not found')
					return res.redirect('back')
				}
				//.author.id is an object, but req.user._id is a strong
				//Check if the id of the logged in user is equal to the id of who posted the campground:
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash('error', 'You do not have permission for that!')
					res.redirect('back');
				}
			}
		})
	} else {
		req.flash('error', 'You need to be logged in to edit this!')
		res.redirect('back')
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		//Renders the edit page for the appropriate campground
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err){
				req.flash('error', 'Comment not found!')
				res.redirect('back')
			} else {
				
				if (!foundCampground){
					req.flash('error', 'Item not found')
					return res.redirect('back')
				}
				//.author.id is an object, but req.user._id is a strong
				//Check if the id of the logged in user is equal to the id of who posted the campground:
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash('error', 'You do not have permission for that!')
					res.redirect('back');
				}
			}
		})
	} else {
		req.flash('error', 'You need to be logged in to edit this!')
		res.redirect('back')
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash('error', 'Please login first!') //Flash will show up on the next redirect
	
    res.redirect("/login");
}

middlewareObj.loginSuccess = function(req, res, next){
		req.flash('success', 'Logged in')
		return next();
}


module.exports = middlewareObj