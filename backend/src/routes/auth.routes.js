const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const identifyUser = require("../middlewares/auth.middleware");

/**
 * POST /api/register  (mounted on /api)
 */
authRouter.post("/register", authController.registerController);

/**
 * POST /api/login  (mounted on /api)
 */
authRouter.post("/login", authController.logginController);

/**
 * POST /api/logout  (mounted on /api)
 */
authRouter.post("/logout", authController.logoutController);

/**
 * @route GET /api/get-me  (mounted on /api)
 * @desc Get the currently logged in user's information
 * @access Private
 */
authRouter.get("/get-me", identifyUser, authController.getMeController);

// Update current user profile
authRouter.put("/update-me", identifyUser, authController.updateMeController);

module.exports = authRouter;
