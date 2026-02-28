import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import "../styles/createpost.scss";

const CreatePostModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_CAPTION_LENGTH = 200; // Instagram limit

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset modal state
  const handleClose = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setCaption("");
    if (typeof onClose === "function") onClose();
    else navigate(-1);
  };

  // Submit post
  const handleSubmit = () => {
    if (selectedImage) {
      onSubmit({ image: selectedImage, caption });
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <button className="back-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
            </svg>
          </button>
          <h2 className="modal-title">Create new post</h2>
          {imagePreview && (
            <button
              className="share-btn"
              onClick={handleSubmit}
              disabled={loading || !selectedImage}
            >
              {loading ? "Posting..." : "Share"}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="modal-content">
          {!imagePreview ? (
            // Upload Section
            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                {/* Image icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.6 77.3" width="97.6" height="77.3" fill="currentColor">
                  <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.7-5.4-.2-2.8-2.6-4.9-5.4-4.7h-.3C12.9 14.1 11 16.5 11.2 19.3c.2 2.5 2.3 4.4 4.8 4.5zm-2.7-7.2c.5-.5 1.2-.8 1.9-.8h.3c1.5.1 2.6 1.3 2.5 2.8-.1 1.5-1.3 2.6-2.8 2.5h-.3c-.7 0-1.4-.4-1.9-.9-.5-.5-.7-1.2-.7-1.9.1-.7.5-1.3 1-1.7z" />
                  <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.4-4.9-9.4-10.4-9.1L9.4 7C4 7.3 0 11.9 0 17.3l.4 7.9 1.4 26.8c.3 5.3 4.8 9.3 10.1 9.1l74.6-4c.5 0 1-.1 1.4-.2 5-1.1 8.2-6.2 7.2-11.2l-5.2-26.2c-.7-3.4-3.4-5.9-5.2-5.2zm.5 7.5l4.6 23c.5 2.3-1 4.5-3.3 5.1L79.9 35.4 68.6 43l-8.5-10.7L57 29l-7 8-20.3-22.9 19.8-1.1 5.4 12.3 14-17.4 15.9.9h.3c1.2 0 2.2.8 2.5 2z" />
                </svg>
              </div>
              <p className="upload-text">Drag photos and videos here</p>
              <button
                className="select-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Select from computer
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            // Preview & Caption Section
            <div className="preview-section">
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  className="change-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </button>
              </div>

              <div className="caption-section">
                <div className="user-info">
                  <div className="profile-avatar">
                    <img
                      src={user?.profileImage || "https://via.placeholder.com/32"}
                      alt={user?.username || "user"}
                    />
                  </div>
                  <span className="username">{user?.username || ""}</span>
                </div>

                <textarea
                  className="caption-input"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CAPTION_LENGTH) {
                      setCaption(e.target.value);
                    }
                  }}
                  maxLength={MAX_CAPTION_LENGTH}
                />

                <div className="caption-footer">
                  <span className="emoji-btn">😊</span>
                  <span className="char-count">
                    {caption.length}/{MAX_CAPTION_LENGTH}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default CreatePostModal;