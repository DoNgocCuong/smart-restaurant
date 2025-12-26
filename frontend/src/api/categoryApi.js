import axiosClient from "./axiosClient";

const categoryApi = {
  getAllCategories: () => axiosClient.get("/menu/categories"),
  createCategory: (data) => axiosClient.post("/menu/categories", data),
  updateCategory: (categoryId, data) =>
    axiosClient.put(`/menu/categories/${categoryId}`, data),
};

export default categoryApi;
