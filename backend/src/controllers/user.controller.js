const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  const followerUsername = req.user.username.trim();
  const followeeUsername = req.params.username.trim();

  // ❌ Self follow check
  if (followeeUsername.toLowerCase() === followerUsername.toLowerCase()) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  // ❌ Check if target user exists
  const targetUser = await userModel.findOne({
    username: followeeUsername.trim().toLowerCase(),
  });

  if (!targetUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // ❌ Already relationship exists?
  const existingFollow = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (existingFollow) {
    return res.status(200).json({
      message:
        existingFollow.status === "pending"
          ? "Follow request already sent"
          : `You are already following ${followeeUsername}`,
      follow: existingFollow,
    });
  }

  // ✅ Decide status based on private/public account
  let status = "accepted";

  if (targetUser.isPrivate) {
    status = "pending";
  }

  // ✅ Create follow record
  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
    status,
  });

  return res.status(200).json({
    message:
      status === "pending"
        ? "Follow request sent"
        : `You are now following ${followeeUsername}`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  // Check kar rahe hain kya current user already is user ko follow kar raha hai ya nahi
  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });
  // Agar follow record nahi mila matlab user follow hi nahi kar raha
  if (!isUserFollowing) {
    return res.status(400).json({
      message: `You must follow this user before unfollowing ${followeeUsername}`,
    });
  }
  // Agar follow record mil gaya to usko delete kar do (unfollow action)
  await followModel.findByIdAndDelete(isUserFollowing._id);
  return res.status(200).json({
    message: `You have unfollowed ${followeeUsername}`,
  });
}

async function acceptRequestController(req, res) {
  const username = req.user.username;
  const followerUsername = req.params.username;

  const follow = await followModel.findOne({
    follower: followerUsername,
    followee: username,
    status: "pending",
  });

  if (!follow) {
    return res.status(200).json({
      message: "Follow request already accepted",
    });
  }

  follow.status = "accepted";
  await follow.save();

  return res.status(200).json({
    message: "Follow request accepted",
  });
}

async function rejectRequestController(req, res) {
  const username = req.user.username;
  const followerUsername = req.params.username;

  const follow = await followModel.findOneAndDelete({
    follower: followerUsername,
    followee: username,
    status: "pending",
  });

  if (!follow) {
    return res.status(404).json({
      message: "Follow request not found",
    });
  }

  return res.status(200).json({
    message: "Follow request rejected",
  });
}

module.exports = {
  followUserController,
  unfollowUserController,
  acceptRequestController,
  rejectRequestController,
};
