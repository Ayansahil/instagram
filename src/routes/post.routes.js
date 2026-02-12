const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

postRouter.post("/",
  upload.single("image"),
  postController.createPostController);

module.exports = postRouter;
