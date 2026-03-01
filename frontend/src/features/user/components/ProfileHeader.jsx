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
    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // Use the same default avatar as the backend schema; this URL is stable and
  // will only be requested if the user has no profileImage.  An onError
  // handler still guards against network failures and replaces it with a simple
  // grey square if needed.
  const PLACEHOLDER = "https://ik.imagekit.io/0cef4ey58/defaultUser.webp";
  const avatarSrc =
    userProfile.profileImage && userProfile.profileImage.trim() !== ""
      ? userProfile.profileImage
      : PLACEHOLDER;

  return (
    <div className="profile-header">
      <div className="profile-avatar-large">
        <div className="profile-gradient">
          <img
            src={avatarSrc}
            alt={userProfile.username}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER;
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