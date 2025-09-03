// src/api/client.js
import axios from "axios";
import { API_CONFIG } from "./config";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Function to get token safely in browser
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Add request interceptor to attach token
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
