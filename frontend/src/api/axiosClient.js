import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

/* ================= CLIENT ================= */
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ============ RAW CLIENT (không interceptor) ============ */
const rawAxios = axios.create({
  baseURL: BASE_URL,
});

/* ================= TOKEN ================= */
const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

/* ============ PUBLIC ENDPOINTS ============ */
const PUBLIC_ENDPOINTS = ["/auth/log-in", "/auth/refresh-token"];

/* ================= REQUEST ================= */
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  const isPublic = PUBLIC_ENDPOINTS.some((p) => config.url.includes(p));

  // ❗ login + refresh-token tuyệt đối KHÔNG gắn Authorization
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

/* ================= REFRESH LOGIC ================= */
let isRefreshing = false;
let queue = [];

/* ================= RESPONSE ================= */
axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    console.log("status: " + status);
    console.log("đây");
    console.log("Không biết: " + originalRequest._retry);

    if (!error.response) return Promise.reject(error);

    // ===== Chỉ refresh khi accessToken hết hạn =====
    if (status === 401 && !originalRequest._retry) {
      // Nếu chính login fail → logout
      console.log("đây");

      if (originalRequest.url.includes("/auth/log-in")) {
        console.log("Không refresh được");
        console.log("đây");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // ===== Nếu đang refresh → đợi =====
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            console.log("đây");

            if (!token) reject(error);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      console.log("đây");

      try {
        const res = await rawAxios.post("/auth/refresh-token");
        console.log("đây");

        const newAccessToken = res.data?.accessToken;

        localStorage.setItem("token", newAccessToken);

        // 🔥 BẮT BUỘC: báo cho AuthContext
        window.dispatchEvent(new Event("token-updated"));

        // Thả queue
        queue.forEach((cb) => cb(newAccessToken));
        queue = [];

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        queue.forEach((cb) => cb(null));
        queue = [];
        console.log("đây");

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
