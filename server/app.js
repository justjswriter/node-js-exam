const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRouter = require("./routers/postRouter")
const userRouter = require("./routers/userRouter")
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"))

mongoose.connect('mongodb+srv://admin:admin@cluster0.8rc2y.mongodb.net/?retryWrites=true&w=majority', (err) => {
    if (err) {
        console.log("ERROR", err);
    } else {
        console.log("server started");
        app.use("/posts", postRouter);
        app.use("/users", userRouter);
        app.listen(8080);
    }
}); 
