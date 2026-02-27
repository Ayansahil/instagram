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