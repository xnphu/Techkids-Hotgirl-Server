const express = require('express');
const UserRouter = express.Router();
const bcrypt = require('bcrypt-nodejs');

const UserModel = require('../models/userModel');

//Mddileware
UserRouter.use((req, res, next) => {
    console.log("User Middleware");
    next();
});

// Get user by id
UserRouter.get("/:id", async (req, res) => {
    let userId = req.params.id;
    try {
        const userFound = await UserModel.findById(userId)
        if (!userFound) {
            res.status(404).json({ success: 0, message: "Not found!" })
        } else {
            res.json({ success: 1, userFound })
        }
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

UserRouter.use((req, res, next) => {
    const { userInfo } = req.session;
    if (userInfo && userInfo.role >= 1) {
        next();
    } else res.status(404).json({ success: 0, message: "Permission denied" });
})

// "/api/users" => get all
UserRouter.get("/", async (req, res) => {
    try {
        const users = await UserModel.find({}, "name email avatar intro posts hashPassword")
            .populate("posts")
        res.json({ success: 1, users })
    } catch (error) {
        res.status(500).json({ success: 0, error: error })
    }

    // UserModel.find({}, "name email avatar intro posts")
    // .populate("posts")
    // .then(users => res.json({ success: 1, users }))
    // .catch(err => res.status(500).json({ success: 0, error: err }))
});

// Create user
UserRouter.post("/", async (req, res) => {
    const { name, email, password, avatar, intro } = req.body;
    try {
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
        const userCreated = await UserModel.create({ name, email, hashPassword, avatar, intro });
        res.status(201).json({ success: 1, userCreated })
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

// Edit user
UserRouter.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { name, password, avatar, intro, posts } = req.body;
    try {
        const userFound = await UserModel.findById(userId)
        if (!userFound) {
            res.status(404).json({ success: 0, message: "Not found!" })
        } else {
            for (key in { name, password, avatar, intro, posts }) {
                if (userFound["hashPassword"] && req.body["password"]) {
                    const plainPasswordNew = req.body["password"];
                    const hashPasswordOld = userFound["hashPassword"];
                    if (!bcrypt.compareSync(plainPasswordNew, hashPasswordOld)) {
                        userFound["hashPassword"] = bcrypt.hashSync(plainPasswordNew, bcrypt.genSaltSync());
                    }
                } else if (userFound[key] && req.body[key]) userFound[key] = req.body[key];
            }
            let userUpdated = userFound.save();
            res.json({ success: 1, user: userUpdated })
        }
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

// Delete user
UserRouter.delete("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        await UserModel.remove({ _id: userId })
        res.json({ success: 1 });
    } catch (error) {
        res.status(500).json({ success: 0, message: error })
    }
});

module.exports = UserRouter;
