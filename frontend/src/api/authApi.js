import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/log-in", data),
  logout: () => axiosClient.post("/auth/log-out"),
  customerSignup: (tenantId, data) =>
    axiosClient.post(`/auth/signup/${tenantId}`, data),
};

export default authApi;
