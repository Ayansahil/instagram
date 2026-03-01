import axios from "axios";

const api = axios.create({
  baseURL: "https://instagram-j2m5.onrender.com/api",
  withCredentials: true,
});

// Safely extract error payload.
// `error.response` is undefined on network errors (ERR_CONNECTION_REFUSED),
// so we fall back to the raw error message instead of crashing.
function extractError(error) {
  if (error.response?.data) {
    return error.response.data;
  }
  return { message: error.message || "Network error. Is the backend running?" };
}

export async function register(username, email, password) {
  try {
    const response = await api.post("/register", { username, email, password });
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
