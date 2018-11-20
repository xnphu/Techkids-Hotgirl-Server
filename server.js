const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const session = require('express-session');

mongoose.connect("mongodb://localhost/techkids-hotgirl");

const userRouter = require('./routers/userRouter');
const imageRouter = require('./routers/imageRouter');
const commentRouter = require('./routers/commentRouter');
const authRouter = require('./routers/authRouter');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: "eiosakdnfaj", //random String
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000 // thoi han luu cookie(7 ngay)
    }
}));

app.get("/api", (req, res) => {
    // const plainTextPassword = "123456789";
    // const salt = bcrypt.genSaltSync(12);
    // const hashPassword = bcrypt.hashSync(plainTextPassword, salt);
    // console.log("Hash: " + hashPassword, "Salt: " + salt);
    // console.log(bcrypt.compareSync(plainTextPassword, hashPassword)); //so sanh password
    // console.log(bcrypt.compareSync("abcxyz", hashPassword));
    console.log(req.session);
    console.log(req.sessionID);

    res.send("Api router");
});

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);
app.use("/api/comments", commentRouter);

const port = 1808;
app.listen(port, (err) => {
    if (err) console.log(err)
    else console.log("Listen at port " + port)
});