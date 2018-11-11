const express = require('express');
const CommentRouter = express.Router();

const CommentModel = require('../models/commentModel');

//Mddileware
CommentRouter.use((req, res, next) => {
    console.log("User Middleware");
    next();
});

// "/api/comments" => get all
CommentRouter.get("/", async (req, res) => {
    console.log("Get all comment");
    try {
        const comments = await CommentModel.find({})
            .populate("user", "name avatar")
        res.json({ success: 1, comments })
    } catch (error) {
        res.status(500).json({ success: 0, error: error })
    }
})

// Get comment by id
CommentRouter.get("/:id", async (req, res) => {
    let commentId = req.params.id;
    try {
        const commentFound = await CommentModel.findById(commentId)
        if (!commentFound) {
            res.status(404).json({ success: 0, message: "Not found!" })
        } else {
            res.json({ success: 1, commentFound })
        }
    } catch (error) {
        res.status(500).json({ success: 0, message: err })
    }
});

// Create comment
CommentRouter.post("/", async (req, res) => {
    const { user, content } = req.body;
    try {
        const commentCreated = await CommentModel.create({ user, content })
        res.status(201).json({ success: 1, commentCreated })
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

// Edit comment
CommentRouter.put("/:id", async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;
    try {
        const commentFound = await CommentModel.findById(commentId)
        if (!commentFound) {
            res.status(404).json({ success: 0, message: "Not found!" })
        } else {
            for (key in { content }) {
                if (commentFound[key] && req.body[key]) commentFound[key] = req.body[key];
            }
            let commentUpdated = commentFound.save()
            res.json({ success: 1, user: commentUpdated })
        }
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

// Delete comment
CommentRouter.delete("/:id", async (req, res) => {
    const commentId = req.params.id;
    try {
        await CommentModel.remove({ _id: commentId })
        res.json({ success: 1 });
    } catch (error) {
        res.status(500).json({ success: 0, message: err})
    }
});

module.exports = CommentRouter;
