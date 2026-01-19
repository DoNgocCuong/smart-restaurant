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

  // 🔥 custom get table by id
  getTableById: async (tableId) => {
    const res = await axiosClient.get("/admin/tables", {
      params: {
        pageNumber: 1,
        pageSize: 1000, // đủ lớn để đảm bảo có table cần tìm
      },
    });

    const tables = res?.result?.content || [];

    return tables.find((table) => table.tableId === tableId) || null;
  },

  getActiveTable: () => axiosClient.get("/admin/tables/active"),

  createTable: (data) => axiosClient.post("/admin/tables", data),

  updateTable: (id, data) => axiosClient.put(`/admin/tables/${id}`, data),
};

export default tableApi;
