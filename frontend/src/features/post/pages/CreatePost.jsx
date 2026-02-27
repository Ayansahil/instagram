import React, { useState, useRef } from "react";
import "../styles/createpost.scss";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const postImageInputFieldRef = useRef(null);

  const navigate = useNavigate();
  const { loading, handleCreatePost } = usePost();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const file = postImageInputFieldRef.current.files[0];

    if (!file) {
      alert("Please select an image");
      return;
    }

    await handleCreatePost(file, caption);
    navigate("/");
  }

  if (loading) {
    return (
      <main className="create-post-page">
        <div className="loading-container">
          <h1>Creating post...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="create-post-page">
      <div className="form-container">
        <h1>Create post</h1>
        <form onSubmit={handleSubmit}>
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
            </div>
          )}

          <label className="post-image-label" htmlFor="postImage">
            {imagePreview ? "Change image" : "Select image"}
          </label>
          <input
            ref={postImageInputFieldRef}
            hidden
            type="file"
            name="postImage"
            id="postImage"
            accept="image/*"
            onChange={handleImageSelect}
          />
          <input
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
            type="text"
            name="caption"
            id="caption"
            placeholder="Enter Caption"
          />
          <button className="button primary-button">create post</button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;
