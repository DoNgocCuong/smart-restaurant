import axiosClient from "./axiosClient";

const orderApi = {
  makeOrder: (data) => axiosClient.post("/orders", data),
  tenantGetAllOrder: () => axiosClient.get("/orders/tenant"),
  updateStatus: (id, data) => axiosClient.patch(`/orders/status/${id}`, data),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  getMyOrder: () => axiosClient.get(`/orders/me`),
};

export default orderApi;
