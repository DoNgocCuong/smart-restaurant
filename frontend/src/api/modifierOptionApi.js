import axiosClient from "./axiosClient";

const modifierOptionApi = {
  create: (data) => axiosClient.post("/menu/modifier-option", data),
  update: (modifierOptionId, data) =>
    axiosClient.put(`/menu/modifier-option/${modifierOptionId}`, data),
};

export default modifierOptionApi;
