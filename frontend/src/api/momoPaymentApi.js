import axiosClient from "./axiosClient";

const momoPaymentApi = {
  // truyền param orderId và orderInfo
  createMomo: (orderId, orderInfo = "Thanh toán cho đơn hàng") =>
    axiosClient.post(`/momo/create/?orderId=${orderId}&orderInfo=${orderInfo}`),
};

export default momoPaymentApi;
