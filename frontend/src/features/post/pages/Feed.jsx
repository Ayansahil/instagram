import { useState, useEffect } from "react";
import { getFeed } from "../services/post.api";
import "../styles/feed.scss";
import Post from "../components/Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getFeed();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="feed-container">
        <div className="loading-state">Loading posts...</div>
      </main>
    );
  }

  if (posts.length === 0) {
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
      {posts.map((post) => (
        <Post key={post._id} post={post} /> 
      ))}
    </main>
  );
};

export default Feed;