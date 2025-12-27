import axiosClient from "./axiosClient";

const imageApi = {
  getByItemId: (itemId) => axiosClient.get(`/images/${itemId}`),
  uploadImages: (itemId, data) => axiosClient.post(`/images/${itemId}`, data),
};

export default imageApi;
