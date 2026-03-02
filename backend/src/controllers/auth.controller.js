const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  const { username, email, password, bio, profileImage } = req.body;

  const isUSerAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUSerAlreadyExists) {
    return res.status(409).json({
      message:
        isUSerAlreadyExists.email === email
          ? "Email already exists"
          : "Username already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    bio,
    profileImage,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  // Set a minimal, secure cookie containing only the JWT token.
  // In development `secure` should be false so localhost works over HTTP.
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function logginController(req, res) {
  const { identifier, password } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ username: identifier }, { email: identifier }],
    })
    .select("+password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Password invalid",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function getMeController(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(userId);

  res.status(200).json({
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function updateMeController(req, res) {
  try {
    const userId = req.user.id;
    const { username, bio, profileImage } = req.body;

    if (username) {
      const existing = await userModel.findOne({ username: username.trim() });
      if (existing && existing._id.toString() !== userId) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    const updateFields = {
      ...(username ? { username: username.trim() } : {}),
      ...(bio !== undefined ? { bio } : {}),
    };
    if (profileImage !== undefined && profileImage.trim() !== "") {
      updateFields.profileImage = profileImage;
    }
    const updated = await userModel.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    return res.status(200).json({
      message: "Profile updated",
      user: {
        username: updated.username,
        email: updated.email,
        bio: updated.bio,
        profileImage: updated.profileImage,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
}

async function logoutController(req, res) {
  try {
    // clear token cookie (match options used when setting it)
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
}

module.exports = {
  registerController,
  logginController,
  getMeController,
  updateMeController,
  logoutController,
};
