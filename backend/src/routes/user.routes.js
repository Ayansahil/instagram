const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser=require("../middlewares/auth.middleware")
const userRouter = express.Router();

/**
 * @route GET /api/users/:username
 * @description Get user profile by username with followers/following counts
 * @access Public
 */
userRouter.get("/:username", userController.getUserProfileController);

/**
 * @route GET /api/users/:username/posts
 * @description Get all posts by a specific user
 * @access Public
 */
userRouter.get("/:username/posts", userController.getUserPostsController);

/**
 * @route GET /api/users/:username/followers
 * @description Get list of followers for a user
 * @access Public
 */
userRouter.get("/:username/followers", userController.getFollowersController);

/**
 * @route GET /api/users/:username/following
 * @description Get list of users the specified user is following
 * @access Public
 */
userRouter.get("/:username/following", userController.getFollowingController);

/**
 * @route POST /api/users/follow/:userid
 * @description Follow a user // Send follow request
 * @access Private
 */
userRouter.post("/follow/:username",identifyUser,userController.followUserController);

/** 
 * @route POST /api/users/unfollow/:userid
 * @description Unfollow a user
 * @access Private
 */
userRouter.post("/unfollow/:username",identifyUser,userController.unfollowUserController)


// Accept request
userRouter.post("/accept-req/:username",identifyUser,userController.acceptRequestController);

// Reject request
userRouter.post("/reject-req/:username",identifyUser,userController.rejectRequestController);

module.exports = userRouter;
