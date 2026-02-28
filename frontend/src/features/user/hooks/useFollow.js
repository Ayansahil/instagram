import { useState } from "react";
import { 
  getFollowers, 
  getFollowing, 
  followUser, 
  unfollowUser 
} from "../services/user.api";

export const useFollow = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetFollowers = async (username) => {
    setLoading(true);
    try {
      const data = await getFollowers(username);
      setFollowers(data.followers || []);
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetFollowing = async (username) => {
    setLoading(true);
    try {
      const data = await getFollowing(username);
      setFollowing(data.following || []);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (username, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
      
      // Update local state
      setFollowers(prev => 
        prev.map(user => 
          user.username === username 
            ? { ...user, isFollowing: !isFollowing }
            : user
        )
      );
      
      setFollowing(prev => 
        prev.map(user => 
          user.username === username 
            ? { ...user, isFollowing: !isFollowing }
            : user
        )
      );
    } catch (error) {
      console.error("Follow toggle failed:", error);
    }
  };

  return {
    followers,
    following,
    loading,
    handleGetFollowers,
    handleGetFollowing,
    handleFollowToggle,
  };
};