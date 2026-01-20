import axiosClient from "./axiosClient";

const employeeApi = {
  // Danh sách bàn mình phục vụ
  getMyTables: () => axiosClient.get("/employee/serving"),
};

export default employeeApi;
