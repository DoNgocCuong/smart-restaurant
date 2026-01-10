import axiosClient from "./axiosClient";

const orderApi = {
  makeOrder: (data) => axiosClient.post("/orders", data),
  tenantGetAllOrder: () => axiosClient.get("/orders/tenant"),
};

export default orderApi;
