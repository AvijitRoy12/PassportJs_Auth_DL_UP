const mongoose = require("mongoose");
const express = require("express");
const app = express();


exports.connectMongoose = () => {
    mongoose.connect("mongodb://localhost:27017/passport")
        .then((e) => console.log('Connected to mongoDB: ${e.connection.host}'))
        .catch((e) => console.log(e));
}
const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
})

exports.User = mongoose.model("User", userSchema);