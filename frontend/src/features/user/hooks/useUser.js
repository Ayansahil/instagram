import { useState } from "react";
import {
  getUserProfile,
  getUserPosts,
  followUser,
  unfollowUser,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../services/user.api";

export const useUser = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch user profile
  const handleGetUserProfile = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserProfile(username);
      setUserProfile(data.user);
      return data.user;
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user posts
  const handleGetUserPosts = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserPosts(username);
      setUserPosts(data.posts || []);
      return data.posts;
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Follow user
  const handleFollowUser = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await followUser(username);
      
      // Update local state
      if (userProfile && userProfile.username === username) {
        setUserProfile((prev) => ({
          ...prev,
          isFollowing: true,
          followStatus: data.status || "pending", 
        }));
      }
      
      alert(data.message || "Follow request sent!");
      return data;
    } catch (err) {
      console.error("Failed to follow user:", err);
      setError(err.message);
      alert("Failed to follow user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Unfollow user
  const handleUnfollowUser = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await unfollowUser(username);
      
      // Update local state
      if (userProfile && userProfile.username === username) {
        setUserProfile((prev) => ({
          ...prev,
          isFollowing: false,
          followStatus: null,
        }));
      }
      
      alert(data.message || "Unfollowed successfully!");
      return data;
    } catch (err) {
      console.error("Failed to unfollow user:", err);
      setError(err.message);
      alert("Failed to unfollow user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept follow request
  const handleAcceptFollowRequest = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await acceptFollowRequest(username);
      alert(data.message || "Follow request accepted!");
      return data;
    } catch (err) {
      console.error("Failed to accept follow request:", err);
      setError(err.message);
      alert("Failed to accept request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reject follow request
  const handleRejectFollowRequest = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const data = await rejectFollowRequest(username);
      alert(data.message || "Follow request rejected!");
      return data;
    } catch (err) {
      console.error("Failed to reject follow request:", err);
      setError(err.message);
      alert("Failed to reject request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    userPosts,
    loading,
    error,
    handleGetUserProfile,
    handleGetUserPosts,
    handleFollowUser,
    handleUnfollowUser,
    handleAcceptFollowRequest,
    handleRejectFollowRequest,
  };
};