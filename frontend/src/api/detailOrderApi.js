import axiosClient from "./axiosClient";

const detailOrderApi = {
  approveNextTime: (orderId) =>
    axiosClient.put(`/detail-orders/orders/${orderId}`),
};

export default detailOrderApi;
