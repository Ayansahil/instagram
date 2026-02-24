import { useState } from "react";

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <article className="post-card">
      {/* ===== HEADER ===== */}
      <header className="post-header">
        <div className="user-info">
          <div className="profile-wrapper">
            <div className="profile-gradient">
              <img
                src={post.user.profileImage}
                alt={post.user.username}
                className="profile-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40";
                }}
              />
            </div>
          </div>

          <div className="user-details">
            <div className="username-row">
              <span className="username">{post.user.username}</span>
            </div>
          </div>
        </div>

        <button className="menu-btn" aria-label="More options">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="6" cy="12" r="1.5" />
            <circle cx="18" cy="12" r="1.5" />
          </svg>
        </button>
      </header>

      {/* ===== IMAGE ===== */}
      <div className="post-image-container">
        <img
          src={post.imgUrl}
          alt={post.caption || "Post image"}
          className="post-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x750";
          }}
        />
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="post-actions">
        <div className="left-actions">
          <button
            className={`action-btn ${isLiked ? "liked" : ""}`}
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Like"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button className="action-btn" aria-label="Comment">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="action-btn" aria-label="Share">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line
                x1="22"
                y1="2"
                x2="11"
                y2="13"
                stroke="currentColor"
                strokeWidth="2"
              />
              <polygon
                points="22 2 15 22 11 13 2 9 22 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        <button
          className={`action-btn bookmark ${isBookmarked ? "bookmarked" : ""}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
          aria-label="Save"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polygon
              points="20 21 12 13.44 4 21 4 3 20 3 20 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </svg>
        </button>
      </div>

      {/* ===== LIKES ===== */}
      <div className="likes-count">
        <span className="count">Be the first to like this</span>
      </div>

      {/* ===== CAPTION ===== */}
      {post.caption && (
        <div className="post-caption">
          <span className="username">{post.user.username}</span>
          <span className="caption-text">{post.caption}</span>
        </div>
      )}

      {/* ===== COMMENT ===== */}
      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button className="post-comment-btn">Post</button>
      </div>
    </article>
  );
};

export default Post;