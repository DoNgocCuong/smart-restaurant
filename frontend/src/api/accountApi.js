import axiosClient from "./axiosClient";

const accountApi = {
  createAccountAdmin: (data) =>
    axiosClient.post("/v1/accounts/create-account-admin", data),
  getAllAdminAccount: () => axiosClient.get("/v1/accounts/all-admin"),
};

export default accountApi;
