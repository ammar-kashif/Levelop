const Comment       = require("../models/comments"),
      Post          = require("../models/post");

// Create a New Comment
module.exports.newComment = async (req, res) => {
    // Finding Post To Add Comment
    const foundPost = await Post.findById(req.params.id).catch(err => console.log(err));
    // Making Comment Object
    const newComment = ({
        text: req.body.text,
        author: {
            id: req.currentUser._id,
            username: req.currentUser.username
        }
    });
    // Making Comment and Pushing to Post according to Schema
    const createdComment = await Comment.create(newComment).catch(err => console.log(err));
    foundPost.comments.push(createdComment);
    foundPost.save();

    // Refresh Post and Populate with Comments
    Post.findById(req.params.id).populate("comments").exec((err, refreshPost) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ createdComment, refreshPost });
        }
    });
}

// Edit a Comment
module.exports.editComment = async (req, res) => {
    let updatedComment = req.body.text 
    const editedComment = await Comment.findByIdAndUpdate(req.params.comment_id, updatedComment).catch(err => console.log(err));
    res.json(editedComment)
}

// Delete a Comment
module.exports.deleteComment = async (req, res) => {
    let deletedComment = await Comment.findByIdAndRemove(req.params.comment_id).catch(err => console.log(err));

    // Refresh Post and Populate with Comments
    Post.findById(req.params.id).populate("comments").exec((err, refreshPost) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true, refreshPost });
        }
    });
}