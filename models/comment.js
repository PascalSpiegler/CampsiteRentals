var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User' //The model that we are referring to with this ID
		},
		username: String
	}
});
 
//Adds to db and exports
module.exports = mongoose.model("Comment", commentSchema);