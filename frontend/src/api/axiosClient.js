import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ KHÔNG gắn token cho auth api
  if (token && !config.url.startsWith("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  (error) => {
    const status = error.response?.status;
    // Nếu token hết hạn → chuyển về login
    if (status === 401 || status === 500) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
