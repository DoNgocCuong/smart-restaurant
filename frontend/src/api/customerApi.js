import axiosClient from "./axiosClient";

const customerApi = {
  createProfile: (data) => axiosClient.post("/customer", data),
  getMyProfile: () => axiosClient.get("/customer/me"),
};

export default customerApi;
