import axiosClient from "./axiosClient";

const itemApi = {
  getAllItems: (
    page = 0,
    size = 100,
    categoryId = null,
    status = null,
    sortBy = "CREATED_DATE",
    direction = "DESC"
  ) => {
    return axiosClient.get("/menu/items", {
      params: {
        page,
        size,
        categoryId,
        status,
        sortBy,
        direction,
      },
    });
  },

  addNewItem: (data) => axiosClient.post("/menu/items", data),

  update: (id, data) => axiosClient.put(`/menu/items/${id}`, data),
};

export default itemApi;
