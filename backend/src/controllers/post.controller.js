const followModel = require("../models/follow.model");
const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");

const imagekit = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
});

async function createPostController(req, res) {
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2-insta-clone-posts",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;
  const posts = await postModel.find({
    user: userId,
  });
  return res.status(200).json({
    message: "Posts fetch successfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "post not found.",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content",
    });
  }

  return res.status(200).json({
    message: "Post fetched successfully",
    post,
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post does not exists.",
    });
  }

  try {
    const like = await likeModel.create({
      post: postId,
      user: username.trim(),
    });

    const likeCount = await likeModel.countDocuments({ post: postId });
    return res.status(200).json({
      message: "Post liked successfully.",
      like,
      likeCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already liked this post.",
      });
    }

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
}

async function unlikePostController(req, res) {
  const postId = req.params.postId;
  const username = req.user.username;

  const existingLike = await likeModel.findOne({
    post: postId,
    user: username,
  });
  if (!existingLike) {
    return res.status(404).json({
      message: "Like not found",
    });
  }

  // remove the like document
  await likeModel.deleteOne({ _id: existingLike._id });
  const likeCount = await likeModel.countDocuments({ post: postId });

  return res.status(200).json({
    message: "Post unliked successfully",
    likeCount,
  });
}

async function getFeedController(req, res) {
  try {
    const currentUser = req.user;

    if (!currentUser || !currentUser.username) {
      return res.status(401).json({
        message: "User not authenticated properly",
      });
    }
    const allPosts = await postModel
      .find()
      .populate("user", "username email bio profileImage isPrivate")
      .sort({ _id: -1 })
      .lean();

    const allowedPosts = [];

    for (const post of allPosts) {
      if (!post.user) continue;

      if (post.user.username === currentUser.username) {
        allowedPosts.push(post);
        continue;
      }

      if (!post.user.isPrivate) {
        allowedPosts.push(post);
        continue;
      }

      const isFollowing = await followModel.findOne({
        follower: currentUser.username,
        followee: post.user.username,
        status: "accepted",
      });

      if (isFollowing) {
        allowedPosts.push(post);
      }
    }
    const postsWithLikes = await Promise.all(
      allowedPosts.map(async (post) => {
        const isLiked = await likeModel.findOne({
          user: currentUser.username,
          post: post._id,
        });
        const likeCount = await likeModel.countDocuments({ post: post._id });
        post.isLiked = Boolean(isLiked);
        post.likeCount = likeCount;
        return post;
      }),
    );

    res.status(200).json({
      message: "posts fetched successfully.",
      posts: postsWithLikes,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
}

async function createCommentController(req, res) {
  try {
    const postId = req.params.postId;
    const user = req.user;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentModel = require("../models/comment.model");

    const comment = await commentModel.create({
      post: postId,
      userId: user.id,
      username: user.username,
      profileImage: user.profileImage || "",
      text: text.trim(),
    });

    return res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).json({ message: "Error creating comment" });
  }
}

async function getCommentsController(req, res) {
  try {
    const postId = req.params.postId;
    const commentModel = require("../models/comment.model");
    const comments = await commentModel
      .find({ post: postId })
      .sort({ createdAt: 1 })
      .lean();
    return res.status(200).json({ comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({ message: "Error fetching comments" });
  }
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  unlikePostController,
  getFeedController,
  createCommentController,
  getCommentsController,
};


