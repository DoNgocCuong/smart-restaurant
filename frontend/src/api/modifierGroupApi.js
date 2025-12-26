import axiosClient from "./axiosClient";

const modifierGroupApi = {
  create: (data) => axiosClient.post("/menu/modifier-group", data),
  getAll: () => axiosClient.get("/menu/modifier-group"),
  update: (modifierGroupId, data) =>
    axiosClient.put(`/menu/modifier-group/${modifierGroupId}`, data),
  findById: (modifierGroupId) =>
    axiosClient.get(`/menu/modifier-group/${modifierGroupId}`),
};

export default modifierGroupApi;
