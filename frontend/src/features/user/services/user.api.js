import axios from "axios";

const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "/api";
  }
  return import.meta.env.VITE_API_URL || "http://localhost:3000/api";
};

const API_BASE_URL = getApiBaseUrl();


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Get user profile by username
export const getUserProfile = async (username) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// ✅ Get user's posts
export const getUserPosts = async (username) => {
  try {
    const response = await api.get(`/users/${username}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// ✅ Follow user
export const followUser = async (username) => {
  try {
    const response = await api.post(`/users/follow/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

// ✅ Unfollow user
export const unfollowUser = async (username) => {
  try {
    const response = await api.post(`/users/unfollow/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

// ✅ Accept follow request
export const acceptFollowRequest = async (username) => {
  try {
    const response = await api.post(`/users/accept-req/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error accepting follow request:", error);
    throw error;
  }
};

// ✅ Reject follow request
export const rejectFollowRequest = async (username) => {
  try {
    const response = await api.post(`/users/reject-req/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    throw error;
  }
};

export const getFollowers = async (username) => {
  try {
    const response = await api.get(`/users/${username}/followers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
};

export const getFollowing = async (username) => {
  try {
    const response = await api.get(`/users/${username}/following`);
    return response.data;
  } catch (error) {
    console.error("Error fetching following:", error);
    throw error;
  }
};

export default api;
