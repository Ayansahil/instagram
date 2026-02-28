import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const getFeed = async () => {
  try {
    const response = await api.get("/posts/feed");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};


export const createPost = async (file, caption) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    const response = await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await api.post(`/posts/like/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await api.post(`/posts/unlike/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
}; 

export const addComment = async (postId, text) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { text });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};