// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://13.62.135.155:8000", // backend base URL
});

// ✅ Add token automatically for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
