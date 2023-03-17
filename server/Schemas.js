const { Schema } = require("mongoose");

const ProjectUserSchema = new Schema({
    fullName: String,
    login: String,
    password: String,
    aboutAuthor: String,
    followedAuthors: [],
});

const ProjectPostSchema = new Schema({
    author: String,
    postHeader: String,
    date: {
        type: Date,
        default: Date.now
    },
    likesAmount: Number,
    postData: String,
});

module.exports = {
    ProjectPostSchema,
    ProjectUserSchema,
};