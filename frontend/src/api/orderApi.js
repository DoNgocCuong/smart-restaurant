import axiosClient from "./axiosClient";

const orderApi = {
  makeOrder: (data) => axiosClient.post("/orders", data),
  tenantGetAllOrder: () => axiosClient.get("/orders/tenant"),
  updateStatus: (id, data) => axiosClient.patch(`/orders/status/${id}`, data),
};

export default orderApi;
