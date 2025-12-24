import axios from "axios";

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;

const axiosClient = axios.create({
  baseURL: `http://localhost:${SERVER_PORT}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== REQUEST ===================== */
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❗ CHỈ BỎ LOGIN – refresh vẫn cần token
  if (token && !config.url.startsWith("/auth/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
/* =================================================== */

/* ===================== REFRESH LOGIC ===================== */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
/* ======================================================== */

/* ===================== RESPONSE ===================== */
axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!error.response) return Promise.reject(error);

    // ===== 401 =====
    if (status === 500 && !originalRequest._retry) {
      // ❌ LOGIN FAIL → logout
      if (originalRequest.url.startsWith("/auth/login")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // ===== WAIT QUEUE =====
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await axiosClient.post("/auth/refresh-token");
        const newToken = res.result.accessToken;

        localStorage.setItem("token", newToken);

        // 🔥 notify AuthContext
        window.dispatchEvent(new Event("token-updated"));

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
/* =================================================== */

export default axiosClient;
