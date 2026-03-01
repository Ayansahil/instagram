const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const identifyUser = require("../middlewares/auth.middleware");

/**
 * POST /api/auth/register
 */
authRouter.post("/register", authController.registerController);

/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.logginController);

/**
 * POST /api/auth/logout
 */
authRouter.post("/logout", authController.logoutController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the currently logged in user's information
 * @access Private
 */
authRouter.get("/get-me", identifyUser, authController.getMeController);
// Update current user profile
authRouter.put("/update-me", identifyUser, authController.updateMeController);

module.exports = authRouter;
