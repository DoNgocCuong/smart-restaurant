import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/log-in", data),
  logout: () => axiosClient.post("/auth/log-out"),
};

export default authApi;
