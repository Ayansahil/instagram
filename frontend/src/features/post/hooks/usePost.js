import { getFeed, createPost, likePost, unlikePost } from "../services/post.api";
import { useContext } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
  const context = useContext(PostContext);
  const { loading, setLoading, post, setPost, feed, setFeed, prependPost } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeed();
      setFeed(data.posts);
    } catch (error) {
      console.error("Failed to load feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (file, caption) => {
    setLoading(true);
    try {
      const response = await createPost(file, caption);
      if (response?.post) {
        prependPost(response.post);
      }
      return response;
    } catch (error) {
      alert("Failed to create post. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const handleLikePost = async (postId) => {
    try {
      const res = await likePost(postId);
      setFeed((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: true,
                likeCount:
                  typeof res.likeCount === "number"
                    ? res.likeCount
                    : (p.likeCount || 0) + 1,
              }
            : p,
        ),
      );
    } catch (error) {
      // swallow, UI already optimistic
    }
  };

  const handleUnlikePost = async (postId) => {
    try {
      const res = await unlikePost(postId);
      setFeed((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: false,
                likeCount:
                  typeof res.likeCount === "number"
                    ? res.likeCount
                    : Math.max((p.likeCount || 1) - 1, 0),
              }
            : p,
        ),
      );
    } catch (error) {
      // swallow
    }
  };

  return {
    loading,
    feed,
    post,
    handleGetFeed,
    handleCreatePost,
    handleLikePost,
    handleUnlikePost,
  };
};