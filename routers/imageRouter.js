const express = require('express');
const ImageRouter = express.Router();

const ImageModel = require('../models/imageModel');

//Mddileware
ImageRouter.use((req, res, next) => {
    console.log("User Middleware");
    next();
});

// "/api/images" => get all
ImageRouter.get("/", (req, res) => {
    console.log("Get all image");
    ImageModel.find({}, "-__v", (err, images) => {
        if (err) res.status(500).json({ success: 0, error: err })
        else res.json({ success: 1, images })
    });
})

// Get image by id
ImageRouter.get("/:id", (req, res) => {
    let imageId = req.params.id;
    ImageModel.findById(imageId, (err, imageFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!imageFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else res.json({ success: 1, imageFound })
    });
});

// Create image
ImageRouter.post("/", (req, res) => {
    const { user, url, caption, title } = req.body;
    ImageModel.create({ user, url, caption, title }, (err, imageCreated) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else res.status(201).json({ success: 1, imageCreated })
    });
});

// Edit image
ImageRouter.put("/:id", (req, res) => {
    const imageId = req.params.id;
    const { caption, title } = req.body;

    ImageModel.findById(imageId, (err, imageFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!imageFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else {
            for (key in { caption, title }) {
                if (imageFound[key] && req.body[key]) imageFound[key] = req.body[key];
            }
            imageFound.save((err, imageUpdated) => {
                if (err) res.status(500).json({ success: 0, message: err })
                else res.json({ success: 1, user: imageUpdated })
            });
        }
    });
});

// Delete image
ImageRouter.delete("/:id", (req, res) => {
    const imageId = req.params.id;

    ImageModel.findById(imageId, (err, imageFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!imageFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else {
            imageFound.delete((err, imageDeleted) => {
                if (err) console.log(err)
                else res.json({ success: 1, user: imageDeleted })
            })
        }
    });
});

module.exports = ImageRouter;
