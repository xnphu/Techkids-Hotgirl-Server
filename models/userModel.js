const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: ({ type: String, required: true }),
    email: ({ type: String, required: true, unique: true }),
    hashPassword: ({ type: String, required: true }),
    avatar: ({ type: String }),
    intro: ({ type: String }),
    posts: [{ type: Schema.Types.ObjectId, ref: "Image" }]
});

UserSchema.pre("save", function (next) {
    console.log(this);
    next();
});

module.exports = mongoose.model("User", UserSchema);
