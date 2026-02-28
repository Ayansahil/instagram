import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const ProfileHeader = ({ 
  userProfile, 
  isFollowing, 
  followStatus, 
  onFollow, 
  onUnfollow,
  postsCount,
  onFollowersClick, 
  onFollowingClick,
  onEditProfile
}) => {
  const { user: currentUser, handleLogout } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = currentUser?.username === userProfile.username;

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-header">
      <div className="profile-avatar-large">
        <div className="profile-gradient">
          <img
            src={userProfile.profileImage}
            alt={userProfile.username}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>
      </div>

      <div className="profile-info">
        <div className="profile-top">
          <h1 className="profile-username">{userProfile.username}</h1>
          
          {isOwnProfile ? (
            <button className="edit-profile-btn" onClick={onEditProfile}>Edit Profile</button>
          ) : (
            <>
              {isFollowing ? (
                followStatus === "pending" ? (
                  <button className="follow-btn pending" disabled>
                    Requested
                  </button>
                ) : (
                  <button
                    className="follow-btn following"
                    onClick={onUnfollow}
                  >
                    Following
                  </button>
                )
              ) : (
                <button className="follow-btn" onClick={onFollow}>
                  Follow
                </button>
              )}
            </>
          )}
          
          {isOwnProfile && (
            <button className="logout-btn" onClick={handleLogoutClick}>
              Log Out
            </button>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-count">
              {typeof postsCount === "number" ? postsCount : userProfile.postsCount || 0}
            </span>
            <span className="stat-label">posts</span>
          </div>
          
          {/* ✅ Make clickable */}
          <div className="stat clickable" onClick={onFollowersClick}>
            <span className="stat-count">{userProfile.followersCount || 0}</span>
            <span className="stat-label">followers</span>
          </div>
          
          {/* ✅ Make clickable */}
          <div className="stat clickable" onClick={onFollowingClick}>
            <span className="stat-count">{userProfile.followingCount || 0}</span>
            <span className="stat-label">following</span>
          </div>
        </div>

        <div className="profile-bio">
          <p className="bio-text">{userProfile.bio || "No bio yet"}</p>
          <p className="email-text">{userProfile.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;