import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <img
        src={comment.profileImage || "https://via.placeholder.com/32"}
        alt={comment.username}
        className="comment-avatar"
      />
      <div className="comment-body">
        <span className="comment-username">{comment.username}</span>
        <span className="comment-text">{comment.text}</span>
      </div>
    </div>
  );
};

export default Comment;
