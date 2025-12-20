import axiosClient from "./axiosClient";

const tenantApi = {
  getTenantProfile: () => axiosClient.get("/v1/tenant/tenant-profile"),
  createInforTenant: (data) =>
    axiosClient.post("/v1/tenant/create-tenant", data),
};

export default tenantApi;
