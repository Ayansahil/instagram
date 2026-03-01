import { useState, useEffect } from "react";
import { getComments, addComment } from "../services/post.api";
import { useAuth } from "../../auth/hooks/useAuth";

export const useComments = (postId) => {
  const { user, handleLogout } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await getComments(postId);
      // use the same default avatar as the backend – keeps UI consistent
      const placeholder = "https://ik.imagekit.io/0cef4ey58/defaultUser.webp";
      setComments(
        (res.comments || []).map((c) => ({
          ...c,
          profileImage: c.profileImage && c.profileImage.trim() !== "" ? c.profileImage : placeholder,
        })),
      );
    } catch (err) {
      // If unauthorized, clear client auth state to stop repeated failing requests
      if (err?.response?.status === 401) {
        try {
          if (typeof handleLogout === "function") await handleLogout();
        } catch (_) {}
        setError("Unauthorized");
        setComments([]);
        return;
      }
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
    const placeholder = "https://ik.imagekit.io/0cef4ey58/defaultUser.webp";
    const temp = {
      _id: `temp-${Date.now()}`,
      post: postId,
      userId: user?.id,
      username: user?.username,
      profileImage: user?.profileImage || placeholder,
      text,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };
    setComments((c) => [...c, temp]);
    try {
      const res = await addComment(postId, text);
      setComments((c) =>
        c.map((cm) =>
          cm._id === temp._id
            ? { ...res.comment, profileImage: res.comment.profileImage || temp.profileImage }
            : cm,
        ),
      );
      return res.comment;
    } catch (err) {
      setComments((c) => c.filter((cm) => cm._id !== temp._id));
      throw err;
    }
  };

  return { comments, loading, error, loadComments, submitComment };
};
