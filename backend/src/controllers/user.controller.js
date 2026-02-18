const followModel = require("../models/follow.model");
const userModel = require("../models/user.modal");

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  // check: user khud ko follow na kare (case-insensitive + trim for safety)
  if (
    followeeUsername.trim().toLowerCase() ===
    followerUsername.trim().toLowerCase()
  ) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  // check: jis user ko follow kar rahe ho kya wo DB me exist karta hai?
  const isFolloweeExists = await userModel.findOne({
    username: followeeUsername,
  });
  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "User you are trying to follow does not exists",
    });
  }

  // check: kya already follow relationship DB me exist karta hai?
  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowing) {
    return res.status(200).json({
      message: `You are already following ${followeeUsername}`,
      follow: isAlreadyFollowing,
    });
  }

  // naya follow relationship create kar rahe hain
  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(200).json({
    message: `You are now following ${followeeUsername}`,
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
    return res.status(200).json({
      message: `You are not following ${followeeUsername}`,
    });
  }
// Agar follow record mil gaya to usko delete kar do (unfollow action)
  await followModel.findByIdAndDelete(isUserFollowing._id)
  return res.status(200).json({
    message: `You have unfollowed ${followeeUsername}`,
  });


}

module.exports = {
  followUserController,
  unfollowUserController,
};
