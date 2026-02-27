import { useEffect } from "react";
import "../styles/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);


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
