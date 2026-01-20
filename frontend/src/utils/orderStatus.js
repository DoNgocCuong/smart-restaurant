import orderApi from "../api/orderApi";

/**
 * Lấy status đơn hàng theo orderId
 * @param {string|number} orderId
 * @returns {Promise<string|null>}
 */
export const getOrderStatusById = async (orderId) => {
  try {
    const res = await orderApi.getById(orderId);
    console.log(res);
    return res?.result?.oderStatus ?? null;
  } catch (error) {
    console.error("Get order status failed:", error);
    return null;
  }
};
