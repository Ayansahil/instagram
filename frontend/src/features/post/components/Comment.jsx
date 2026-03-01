import React from "react";

// inline SVG placeholder avoids external network requests that may fail
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%3E%3Crect%20width='32'%20height='32'%20fill='%23ccc'/%3E%3C/svg%3E";

const Comment = ({ comment }) => {
  const avatar = comment.user?.profileImage || DEFAULT_AVATAR;

  return (
    <div className="comment">
      <img
        src={avatar}
        alt={comment.user?.username}
        className="comment-avatar"
      />
      <div className="comment-body">
        <span className="comment-username">{comment.user?.username}</span>
        <span className="comment-text">{comment.text}</span>
      </div>
    </div>
  );
};

export default Comment;
