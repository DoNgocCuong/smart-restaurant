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

  addNewItem: (data) => axiosClient.post("/api/menu/items", data),
};

export default itemApi;
