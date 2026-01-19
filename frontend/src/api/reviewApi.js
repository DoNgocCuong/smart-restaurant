import axiosClient from "./axiosClient";

const reviewApi = {
  getByItemId: (itemId) => axiosClient.get(`/reviews/${itemId}`),
  makeReview: (customerId, data) =>
    axiosClient.post(`/reviews/${customerId}`, data),
};

export default reviewApi;
