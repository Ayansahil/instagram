import { useState, useEffect } from "react";
import { getComments, addComment } from "../services/post.api";
import { useAuth } from "../../auth/hooks/useAuth";

export const useComments = (postId) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await getComments(postId);
      setComments(res.comments || []);
    } catch (err) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) loadComments();
  }, [postId]);

  const submitComment = async (text) => {
    if (!text || !text.trim()) return;
    // optimistic comment
    const temp = {
      _id: `temp-${Date.now()}`,
      post: postId,
      userId: user?.id,
      username: user?.username,
      profileImage: user?.profileImage || "",
      text,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };
    setComments((c) => [...c, temp]);
    try {
      const res = await addComment(postId, text);
      // replace temp with real
      setComments((c) => c.map((cm) => (cm._id === temp._id ? res.comment : cm)));
      return res.comment;
    } catch (err) {
      // remove temp on failure
      setComments((c) => c.filter((cm) => cm._id !== temp._id));
      throw err;
    }
  };

  return { comments, loading, error, loadComments, submitComment };
};
