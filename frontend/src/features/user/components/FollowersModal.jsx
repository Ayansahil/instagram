import { useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import "../styles/followersmodal.scss";

const PLACEHOLDER = "https://ik.imagekit.io/0cef4ey58/defaultUser.webp";

const FollowersModal = ({ 
  isOpen, 
  onClose, 
  type, 
  users, 
  loading,
  onFollowToggle 
}) => {
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {type === "followers" ? "Followers" : "Following"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.12 5.7a1 1 0 10-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 101.42 1.42L12 13.41l4.88 4.89a1 1 0 001.42-1.42L13.41 12l4.89-4.88a1 1 0 000-1.42z"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>

        {/* List */}
        <div className="users-list">
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              No {type === "followers" ? "followers" : "following"} yet
            </div>
          ) : (
            users.map((user) => {
              const isOwnProfile = currentUser?.username === user.username;
              
              return (
                <div key={user.username} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar">
                      <img
                        src={user.profileImage || PLACEHOLDER}
                        alt={user.username}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = PLACEHOLDER;
                        }}
                      />
                    </div>
                    <div className="user-details">
                      <span className="username">{user.username}</span>
                      {user.bio && (
                        <span className="user-bio">{user.bio}</span>
                      )}
                      {user.mutualFollowers && (
                        <span className="mutual-text">
                          Followed by {user.mutualFollowers}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <button
                      className={`follow-btn ${user.isFollowing ? "following" : ""}`}
                      onClick={() => onFollowToggle(user.username, user.isFollowing)}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;