import axiosClient from "./axiosClient";

const qrApi = { getQRById: (id) => axiosClient.get(`/qr/${id}`) };

export default qrApi;
