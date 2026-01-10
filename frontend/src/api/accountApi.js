import axiosClient from "./axiosClient";

const accountApi = {
  createAccountAdmin: (data) =>
    axiosClient.post("/v1/accounts/create-account-admin", data),
  getAllAdminAccount: () => axiosClient.get("/v1/accounts/all-admin"),
  getAllStaff: () =>
    axiosClient.get("/v1/accounts/tenant/get-all-staff-kitchen"),
  // Hàm thêm nhân viên, dựa vào role
  addStaff: (role, data) => {
    if (role === "STAFF") {
      return axiosClient.post("/v1/accounts/create-account-staff", data);
    } else if (role === "KITCHEN_STAFF") {
      return axiosClient.post("/v1/accounts/create-account-kitchen", data);
    } else {
      return Promise.reject(new Error("Role không hợp lệ"));
    }
  },
  createCustomerAccount: (tenantId, data) =>
    axiosClient.post(`/v1/accounts/customer/${tenantId}`, data),
};

export default accountApi;
