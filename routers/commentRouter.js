const express = require('express');
const CommentRouter = express.Router();

const CommentModel = require('../models/commentModel');

//Mddileware
CommentRouter.use((req, res, next) => {
    console.log("User Middleware");
    next();
});

// "/api/comments" => get all
CommentRouter.get("/", (req, res) => {
    console.log("Get all comment");
    CommentModel.find({}, "-__v", (err, comments) => {
        if (err) res.status(500).json({ success: 0, error: err })
        else res.json({ success: 1, comments })
    });
})

// Get comment by id
CommentRouter.get("/:id", (req, res) => {
    let commentId = req.params.id;
    CommentModel.findById(commentId, (err, commentFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!commentFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else res.json({ success: 1, commentFound })
    });
});

// Create comment
CommentRouter.post("/", (req, res) => {
    const { user, content } = req.body;
    CommentModel.create({ user, content }, (err, commentCreated) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else res.status(201).json({ success: 1, commentCreated })
    });
});

// Edit comment
CommentRouter.put("/:id", (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;

    CommentModel.findById(commentId, (err, commentFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!commentFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else {
            for (key in { content }) {
                if (commentFound[key] && req.body[key]) commentFound[key] = req.body[key];
            }
            commentFound.save((err, commentUpdated) => {
                if (err) res.status(500).json({ success: 0, message: err })
                else res.json({ success: 1, user: commentUpdated })
            });
        }
    });
});

// Delete comment
CommentRouter.delete("/:id", (req, res) => {
    const commentId = req.params.id;

    CommentModel.findById(commentId, (err, commentFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!commentFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else {
            commentFound.delete((err, commentDeleted) => {
                if (err) console.log(err)
                else res.json({ success: 1, user: commentDeleted })
            })
        }
    });
});

module.exports = CommentRouter;
