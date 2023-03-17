const express = require("express");
const { ProjectUserModel } = require("../Models");
const router = express.Router();

router.get("/", (req, res) => {
    ProjectUserModel.find({}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
}) 

router.get("/:id", (req, res) => {
    const id = req.params.id;
    ProjectUserModel.findById(id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    })
})

router.post("/auth", (req, res) => {
    const {login, password } = req.body;
    ProjectUserModel.find({login: login, password: password}, (err, results) => {
        if (err) {
            res.status(500).send("null");
        } else {
            res.status(200).send(results);
        }
    });
})

router.post("/", (req, res) => {
    const { fullName, login, password } = req.body;
    const newUser = new ProjectUserModel({ fullName, login, password, aboutAuthor: "", followedAuthors: []});
    newUser.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("User added");
        }
    });
})

router.put("/:id", async (req, res) => {
    const id = req.params.id
    const { fullName, aboutAuthor } = req.body;
    await ProjectUserModel.findByIdAndUpdate(id,{fullName: fullName, aboutAuthor: aboutAuthor})
    res.send("User info updated");
});

router.post("/followUser", async (req, res) => {
    const { userId, followedUserId } = req.body;
    const user = await ProjectUserModel.findById(userId);

    user.followedAuthors.push(followedUserId)
    user.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("User followed");
        }
    });
});

router.post("/unFollowUser", async (req, res) => {
    const { userId, followedUserId } = req.body;
    const user = await ProjectUserModel.findById(userId);

    await ProjectUserModel.findByIdAndUpdate(userId,{followedAuthors: user.followedAuthors.filter((user) => user != followedUserId)})
    res.status(201).send("User unfollowed");

});


module.exports = router;