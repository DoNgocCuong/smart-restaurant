import axiosClient from "./axiosClient";

const qrApi = {
  getQRById: (id) => axiosClient.get(`/qr/${id}`),
  generateQrbyId: (id) => axiosClient.post(`/qr/${id}`),
};

export default qrApi;
