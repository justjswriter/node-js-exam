const express = require("express");
const { ProjectPostModel, ProjectUserModel } = require("../Models");
const router = express.Router();

router.get("/", (req, res) => {
    ProjectPostModel.find({}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
})

router.get("/:id", (req, res) => {
    const id = req.params.id;
    ProjectPostModel.find({author: id}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
})

router.get("/update/:id", (req, res) => {
    const id = req.params.id;
    ProjectPostModel.find({_id: id}, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results);
        }
    });
})


router.post("/", async (req, res) => {
    const { author, postHeader, postData } = req.body;

    const newPost = new ProjectPostModel({ author, postHeader, postData, likesAmount: 0});
    newPost.save((err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send("new post created");
        }
    });
})

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    ProjectPostModel.findByIdAndDelete(id, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send("Post deleted");
        }
    });
})

router.put("/:id", async (req, res) => {
    const id = req.params.id
    const { postHeader, postData } = req.body;
    await ProjectPostModel.findByIdAndUpdate(id,{postHeader: postHeader, postData: postData})
    res.send("Post data updated");
});

router.get("/like/:id", async (req, res) => {
    const postId = req.params.id
    const post = await ProjectPostModel.findById(postId);
    await ProjectPostModel.findByIdAndUpdate(postId,{likesAmount: post.likesAmount + 1})
    res.status(201).send("Post liked");
});

router.get("/unlike/:id", async (req, res) => {
    const postId = req.params.id
    const post = await ProjectPostModel.findById(postId);
    await ProjectPostModel.findByIdAndUpdate(postId,{likesAmount: post.likesAmount - 1})
    res.status(201).send("Post unliked");
});

module.exports = router;