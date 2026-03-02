import axios from "axios";

const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "/api";
  }
  return import.meta.env.VITE_API_URL || "http://localhost:3000/api";
};

const API_BASE_URL = getApiBaseUrl();
console.log("🔗 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function extractError(error) {
  if (error.response?.data) {
    return error.response.data;
  }
  return { message: error.message || "Network error. Is the backend running?" };
}

export async function register(username, email, password) {
  try {
    // auth routes no longer include the `/auth` segment in production build
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function login(identifier, password) {
  try {
    const response = await api.post("/login", { identifier, password });
    return response.data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function getMe() {
  try {
    const response = await api.get("/get-me");
    return response.data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function logout() {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function updateUser(payload) {
  try {
    const response = await api.put("/update-me", payload);
    return response.data;
  } catch (error) {
    throw extractError(error);
  }
}
