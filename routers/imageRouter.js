const express = require('express');
const ImageRouter = express.Router();

const ImageModel = require('../models/imageModel');

//Mddileware
ImageRouter.use((req, res, next) => {
    console.log("User Middleware");
    next();
});

// "/api/images" => get all
ImageRouter.get("/", async (req, res) => {
    console.log("Get all image");
    try {
        const images = await ImageModel.find({})
            .populate("user", "name avatar").populate("comments", "content")
        res.json({ success: 1, images })
    } catch (error) {
        res.status(500).json({ success: 0, error: error })
    }
})

// Get image by id
ImageRouter.get("/:id", async (req, res) => {
    let imageId = req.params.id;
    try {
        const imageFound = await ImageModel.findById(imageId)
        if (!imageFound) {
            res.status(404).json({ success: 0, message: "Not found!" })
        } else {
            res.json({ success: 1, imageFound })
        }
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

// Create image
ImageRouter.post("/", async (req, res) => {
    const { user, url, caption, title } = req.body;
    try {
        const imageCreated = await ImageModel.create({ user, url, caption, title })
        res.status(201).json({ success: 1, imageCreated })
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

// Edit image
ImageRouter.put("/:id", async (req, res) => {
    const imageId = req.params.id;
    const { url, caption, title, comments } = req.body;
    try {
        const imageFound = await ImageModel.findById(imageId)
        if (!imageFound) {
            res.status(404).json({ success: 0, message: "Not found!" })
        } else {
            for (key in { url, caption, title, comments }) {
                if (imageFound[key] && req.body[key]) imageFound[key] = req.body[key];
            }
            let imageUpdated = imageFound.save()
            res.json({ success: 1, user: imageUpdated })
        }
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

// Delete image
ImageRouter.delete("/:id", async (req, res) => {
    const imageId = req.params.id;
    try {
        await ImageModel.remove({ _id: imageId })
        res.json({ success: 1 });
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

module.exports = ImageRouter;
