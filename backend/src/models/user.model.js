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
    select: false,
  },
  bio: String,
  profileImage: {
    type: String,
    default: "https://ik.imagekit.io/0cef4ey58/defaultUser.webp",
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Virtual fields for followers and following counts
userSchema.virtual("followersCount").set(function(value) {
  this._followersCount = value;
}).get(function() {
  return this._followersCount || 0;
});

userSchema.virtual("followingCount").set(function(value) {
  this._followingCount = value;
}).get(function() {
  return this._followingCount || 0;
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
