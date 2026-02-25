import { useEffect } from "react";
import "../styles/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else {
        handleGetFeed();
      }
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <main className="feed-container">
        <div className="loading-state">Checking authentication...</div>
      </main>
    );
  }
  if (!user) {
    return null;
  }

  if (loading || !feed) {
    return (
      <main className="feed-container">
        <div className="loading-state">Loading posts...</div>
      </main>
    );
  }

  if (feed.length === 0) {
    return (
      <main className="feed-container">
        <div className="empty-state">
          <p>No posts yet. Start following people to see their posts!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="feed-container">
      {feed.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </main>
  );
};

export default Feed;
