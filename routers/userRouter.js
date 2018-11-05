const express = require('express');
const UserRouter = express.Router();

const UserModel = require('../models/userModel');

//Mddileware
UserRouter.use((req, res, next) => {
    console.log("User Middleware");
    next();
});

// "/api/users" => get all
UserRouter.get("/", (req, res) => {
    console.log("Get all user");
    UserModel.find({}, "-password -__v", (err, users) => {
        if (err) res.status(500).json({ success: 0, error: err })
        else res.json({ success: 1, users })
    });
})

// Get user by id
UserRouter.get("/:id", (req, res) => {
    let userId = req.params.id;
    UserModel.findById(userId, (err, userFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!userFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else res.json({ success: 1, userFound })
    });
});

// Create user
UserRouter.post("/", (req, res) => {
    const { name, email, password, avatar, intro } = req.body;
    UserModel.create({ name, email, password, avatar, intro }, (err, userCreated) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else res.status(201).json({ success: 1, userCreated })
    });
});

// Edit user
UserRouter.put("/:id", (req, res) => {
    const userId = req.params.id;
    const { name, password, avatar, intro } = req.body;

    UserModel.findById(userId, (err, userFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!userFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else {
            // userFound.name = name || userFound.name;
            // userFound.password = password || userFound.password;
            // userFound.avatar = avatar || userFound.avatar;
            // userFound.intro = intro || userFound.intro;

            for (key in { name, password, avatar, intro }) {
                if (userFound[key] && req.body[key]) userFound[key] = req.body[key];
            }
            userFound.save((err, userUpdated) => {
                if (err) res.status(500).json({ success: 0, message: err })
                else res.json({ success: 1, user: userUpdated })
            });
        }
    });
});

// Delete user
UserRouter.delete("/:id", (req, res) => {
    const userId = req.params.id;

    UserModel.findById(userId, (err, userFound) => {
        if (err) res.status(500).json({ success: 0, message: err })
        else if (!userFound._id) res.status(404).json({ success: 0, message: "Not found!" })
        else {
            userFound.delete((err, userDeleted) => {
                if (err) console.log(err)
                else res.json({ success: 1, user: userDeleted })
            })
        }
    });
});

module.exports = UserRouter;
