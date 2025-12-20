import { data } from "react-router";
import axiosClient from "./axiosClient";

const accountApi = {
  createAccountAdmin: (data) =>
    axiosClient.post("/v1/accounts/create-account-admin", data),
};

export default accountApi;
