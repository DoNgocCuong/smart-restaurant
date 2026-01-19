import customerApi from "../api/customerApi";

export const fetchMyCustomerId = async () => {
  const res = await customerApi.getMyProfile();
  return res?.result?.customerId ?? null;
};
