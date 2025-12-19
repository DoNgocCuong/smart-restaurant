import axiosClient from "./axiosClient";

const tableApi = {
  // lấy danh sách bàn (có phân trang)
  getAllTable: (pageNumber = 1, pageSize = 50) => {
    return axiosClient.get("/admin/tables", {
      params: {
        pageNumber,
        pageSize,
      },
    });
  },

  createTable: (data) => axiosClient.post("/admin/tables", data),
};

export default tableApi;
