import { data } from "react-router";
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

  updateTable: (id, data) => axiosClient.put(`/admin/tables/${id}`, data),
};

export default tableApi;
