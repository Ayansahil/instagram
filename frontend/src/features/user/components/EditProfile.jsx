import { useState, useEffect } from "react";
import { useEditProfile } from "../hooks/useEditProfile";
import "../styles/editprofile.scss";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='96'%20height='96'%3E%3Crect%20width='96'%20height='96'%20fill='%23ccc'/%3E%3C/svg%3E";

const EditProfile = ({ onClose, onSaved }) => {
  const { user, updateProfile, loading } = useEditProfile();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setProfileImage(user.profileImage || "");
      setImagePreview(user.profileImage || "");
    }
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleImageChange = (url) => {
    setProfileImage(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!username.trim()) {
      return setError("Username is required");
    }

    try {
      // Only include profileImage if user actually entered a non-empty value.
      // Prevents accidentally wiping out the image by submitting an empty string.
      const payload = {
        username: username.trim(),
        bio: bio.trim(),
      };
      if (profileImage && profileImage.trim() !== "") {
        payload.profileImage = profileImage.trim();
      }
      await updateProfile(payload);
      if (onSaved) onSaved();
      else if (onClose) onClose();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.12 5.7a1 1 0 10-1.42 1.42L10.59 12l-4.89 4.88a1 1 0 101.42 1.42L12 13.41l4.88 4.89a1 1 0 001.42-1.42L13.41 12l4.89-4.88a1 1 0 000-1.42z"/>
            </svg>
          </button>
          <h2 className="modal-title">Edit Profile</h2>
          <button 
            className="save-btn" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Done"}
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {error && <div className="error-banner">{error}</div>}

          {/* Profile Picture */}
          <div className="profile-section">
            <div className="profile-image-wrapper">
              <div className="profile-gradient">
                <img
                  src={imagePreview || PLACEHOLDER}
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER;
                  }}
                />
              </div>
            </div>
            <div className="profile-info">
              <span className="username-display">{username || "username"}</span>
              <button 
                type="button" 
                className="change-photo-btn"
                onClick={() => {
                  const url = prompt("Enter image URL:");
                  if (url) handleImageChange(url);
                }}
              >
                Change profile photo
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                maxLength={30}
              />
              <span className="char-count">{username.length}/30</span>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a bio..."
                maxLength={150}
                rows={3}
              />
              <span className="char-count">{bio.length}/150</span>
            </div>

            <div className="form-group">
              <label htmlFor="profileImage">Profile Image URL</label>
              <input
                id="profileImage"
                type="url"
                value={profileImage}
                onChange={(e) => handleImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;