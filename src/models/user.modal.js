const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exists"],
    require: [true, "Username is required"],
  },

  email: {
    type: String,
    unique: [true, "Email already exists"],
    require: [true, "Email is required"],
  },

  password: {
    type: String,
    require: [true, "Password is required"],
  },
  bio: String,
  profileImage: {
    type: String,
    default: "https://ik.imagekit.io/0cef4ey58/defaultUser.webp",
  },
});

const userModel = mongoose.model("User", userSchema, "Insta-user");

module.exports = userModel;
