import axiosClient from "./axiosClient";

const orderApi = {
  makeOrder: (data) => axiosClient.post("/orders", data),
  tenantGetAllOrder: () => axiosClient.get("/orders/tenant"),
  updateStatus: (id, data) => axiosClient.patch(`/orders/status/${id}`, data),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  getMyOrder: () => axiosClient.get(`/orders/me`),
  customerUpdate: (orderId, data) =>
    axiosClient.put(`/orders/${orderId}`, data),
  createInvoice: (orderId) => axiosClient.post(`orders/${orderId}`),
};

export default orderApi;
