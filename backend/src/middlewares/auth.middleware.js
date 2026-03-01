const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided, Unauthorized access",
    });
  }
  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "user not authorized",
    });
  }

  // decoded may contain only { id } once we stopped storing username/other data
  // fetch current username (and optionally other frequently used fields) so
  // controllers relying on req.user.username continue to work without storing
  // these values in the token.
  if (decoded && decoded.id) {
    const userModel = require("../models/user.model");
    try {
      const user = await userModel.findById(decoded.id).select("username").lean();
      req.user = { id: decoded.id, username: user ? user.username : null };
    } catch (err) {
      console.error("Failed to load user in middleware:", err);
      req.user = { id: decoded.id };
    }
  } else {
    req.user = decoded;
  }
  next();
}

module.exports = identifyUser;
