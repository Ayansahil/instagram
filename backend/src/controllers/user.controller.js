const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

/**
 * Get user profile by username with followers/following counts
 */
async function getUserProfileController(req, res) {
  const { username } = req.params;
  
  try {
    const user = await userModel.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Count followers (people following this user)
    const followersCount = await followModel.countDocuments({
      followee: user.username,
      status: "accepted",
    });

    // Count following (people this user follows)
    const followingCount = await followModel.countDocuments({
      follower: user.username,
      status: "accepted",
    });

    // Check if current user is following this user
    let isFollowing = false;
    let followStatus = null;

    if (req.user) {
      const followRecord = await followModel.findOne({
        follower: req.user.username,
        followee: user.username,
      });

      if (followRecord) {
        isFollowing = true;
        followStatus = followRecord.status;
      }
    }

    // also include a simple post count so the frontend doesn't have to infer it
    const postModel = require("../models/post.model");
    const postsCount = await postModel.countDocuments({ user: user._id });

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        isPrivate: user.isPrivate,
        followersCount,
        followingCount,
        postsCount,
        isFollowing,
        followStatus,
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({
      message: "Error fetching user profile",
    });
  }
}

/**
 * Get user posts by username
 */
async function getUserPostsController(req, res) {
  const { username } = req.params;

  try {
    const user = await userModel.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const postModel = require("../models/post.model");
    let posts = await postModel
      .find({ user: user._id })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 })
      .lean();

    // include likes info so frontend can render like count/status
    const likeModel = require("../models/like.model");
    posts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await likeModel.countDocuments({ post: post._id });
        const isLiked = req.user
          ? Boolean(
              await likeModel.findOne({
                post: post._id,
                user: req.user.username,
              }),
            )
          : false;
        post.likeCount = likeCount;
        post.isLiked = isLiked;
        return post;
      }),
    );

    return res.status(200).json({
      posts,
      count: posts.length,
    });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    return res.status(500).json({
      message: "Error fetching user posts",
    });
  }
}

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

/**
 * Get followers list for a user
 */
async function getFollowersController(req, res) {
  const { username } = req.params;

  try {
    const user = await userModel.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get accepted followers records (people who follow this user)
    const followerRecords = await followModel
      .find({ followee: user.username, status: "accepted" })
      .sort({ createdAt: -1 })
      .lean();

    const followerUsernames = followerRecords.map((r) => r.follower);

    // Fetch user details for followers
    const followerUsers = await userModel
      .find({ username: { $in: followerUsernames } })
      .select("username bio profileImage")
      .lean();

    // Prepare a quick lookup for whether the requesting user follows each follower (so we can render follow buttons)
    const currentUsername = req.user ? req.user.username : null;
    let currentUserFollowingSet = new Set();

    if (currentUsername) {
      const currentFollowingRecords = await followModel.find({
        follower: currentUsername,
        followee: { $in: followerUsernames },
        status: "accepted",
      });
      currentUserFollowingSet = new Set(currentFollowingRecords.map((r) => r.followee));
    }

    // For mutual followers count: get followers of the requested user and of the current user (if any)
    let currentUserFollowersSet = new Set();
    if (currentUsername) {
      const curFollowers = await followModel.find({ followee: currentUsername, status: "accepted" });
      currentUserFollowersSet = new Set(curFollowers.map((r) => r.follower));
    }

    const followers = followerUsers.map((fu) => ({
      username: fu.username,
      profileImage: fu.profileImage || null,
      bio: fu.bio || null,
      isFollowing: currentUsername ? currentUserFollowingSet.has(fu.username) : false,
      mutualFollowers: currentUsername ? Array.from(currentUserFollowersSet).filter((x) => followerUsernames.includes(x)).length : 0,
    }));

    return res.status(200).json({ followers });
  } catch (err) {
    console.error("Error fetching followers:", err);
    return res.status(500).json({ message: "Error fetching followers" });
  }
}

/**
 * Get following list for a user
 */
async function getFollowingController(req, res) {
  const { username } = req.params;

  try {
    const user = await userModel.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get accepted following records (people this user follows)
    const followingRecords = await followModel
      .find({ follower: user.username, status: "accepted" })
      .sort({ createdAt: -1 })
      .lean();

    const followingUsernames = followingRecords.map((r) => r.followee);

    const followingUsers = await userModel
      .find({ username: { $in: followingUsernames } })
      .select("username bio profileImage")
      .lean();

    const currentUsername = req.user ? req.user.username : null;
    let currentUserFollowingSet = new Set();

    if (currentUsername) {
      const currentFollowingRecords = await followModel.find({
        follower: currentUsername,
        followee: { $in: followingUsernames },
        status: "accepted",
      });
      currentUserFollowingSet = new Set(currentFollowingRecords.map((r) => r.followee));
    }

    const following = followingUsers.map((fu) => ({
      username: fu.username,
      profileImage: fu.profileImage || null,
      bio: fu.bio || null,
      isFollowing: currentUsername ? currentUserFollowingSet.has(fu.username) : false,
      mutualFollowers: 0,
    }));

    return res.status(200).json({ following });
  } catch (err) {
    console.error("Error fetching following:", err);
    return res.status(500).json({ message: "Error fetching following" });
  }
}

module.exports = {
  getUserProfileController,
  getUserPostsController,
  followUserController,
  unfollowUserController,
  acceptRequestController,
  rejectRequestController,
  getFollowersController,
  getFollowingController,
};
