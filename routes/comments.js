// ===============================================================================================================
// 	COMMENTS ROUTE	COMMENTS ROUTE 	COMMENTS ROUTE 	COMMENTS ROUTE 	COMMENTS ROUTE 	COMMENTS ROUTE 	COMMENTS ROUTE 
// ===============================================================================================================

var express = require('express');
var router = express.Router({mergeParams:true}); //Merges the paramaters from campground and comments, lets you find id defined in campgrounds.ejs
var Campground = require('../campground');
var Comment = require('../models/comment');
var middleware = require('../middleware') //Automatically takes index.js



//NEW comments
router.get("/new", middleware.isLoggedIn, function(req, res){
	//Finding campground by id:
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err)
		} else {
			if(!campground){
				req.flash('error', 'Item not found');
				return res.redirect('back');
			}
			res.render("comments/new", {campground: campground})
		}
	})
	
})


//SAVE comments
router.post("/", middleware.isLoggedIn, function(req, res){
	//Look up the campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err)
			req.flash('error', 'Something went wrong')
			res.redirect('/campgrounds')
		} else {
			//Create new comments
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash('error', 'Something went wrong')
					console.log(err)
				} else {
					if(!comment){
						req.flash('error', 'Item not found');
						return res.redirect('back');
					}
					//Adding username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Saving comment
					comment.save()
					//Connect comment to campground
					campground.comments.push(comment);
					campground.save()
					req.flash('success', 'Added comment!')
					res.redirect('/campgrounds/' + campground._id)
				}
			})
			
			
			//Redirect ro campground show page
		}
	})
	
})

//EDIT comment

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err){
			res.redirect('back')
		} else {
			if(!foundComment){
				req.flash('error', 'Item not found');
				return res.redirect('back');
			}
			res.render('comments/edit', {campground_id:req.params.id, comment:foundComment})
		}
	})
})

//UPDATE comment
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err){
			req.flash('error', 'Something went wrong')
			res.redirect('back')
		} else {
			if(!updatedComment){
				req.flash('error', 'Item not found');
				return res.redirect('back');
			}
			req.flash('success', 'Updated comment!')
			res.redirect('/campgrounds/'+req.params.id)
		}
	})
})

//DESTROY comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	//Find comment by ID and remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash('error', 'Something went wrong')
			res.redirect('back')
		} else {
			req.flash('success', 'Deleted comment')
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})


module.exports = router;
