import { X, History, Clock, AlertCircle } from "lucide-react";
import Overlay from "../common/Overlay";
import { useState, useEffect } from "react";
import orderApi from "../../api/orderApi";
import { STATUS_META } from "../../utils/statusMeta";
import { isGuest } from "../../utils/jwt";
import toast from "react-hot-toast";

export default function OrderHistoryModal({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getMyOrder();

      let sortedOrders = (res.result || []).sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt),
      );

      // 👉 Nếu là guest
      if (isGuest()) {
        const now = Date.now();
        const TWO_HOURS = 2 * 60 * 60 * 1000;

        // Lọc các order trong vòng 2 giờ
        const recentOrders = sortedOrders.filter(
          (order) => now - new Date(order.createAt).getTime() <= TWO_HOURS,
        );

        // Chỉ giữ order gần nhất
        sortedOrders = recentOrders.slice(0, 1);
      }

      console.log(sortedOrders);

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Lỗi lấy lịch sử đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRequestPayment = async (orderId) => {
    try {
      await orderApi.updateStatus(orderId, { status: "Pending_payment" });
      toast.success(
        "Yêu cầu thanh toán thành công, vui lòng đợi trong giây lát",
      );
      fetchOrders();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      setError("Không thể yêu cầu thanh toán");
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-linear-to-br from-white to-blue-50 w-[90vw] max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-3 text-white">
            <div className="bg-white/20 p-2 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <span>Lịch sử đơn hàng</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-blue-400" />
              </div>
              <p className="text-gray-600 font-medium">Chưa có đơn hàng nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Lịch sử đơn hàng của bạn sẽ hiển thị ở đây
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[65vh] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
              {orders.map((order) => {
                const total = order.detailOrders.reduce(
                  (sum, item) =>
                    sum +
                    item.quantity *
                      (item.price +
                        (item.modifiers?.reduce(
                          (mSum, m) => mSum + m.price,
                          0,
                        ) || 0)),
                  0,
                );

                const statusMeta =
                  STATUS_META[order.oderStatus] || STATUS_META.Pending_approval;
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={order.orderId}
                    className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Order header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg text-gray-800">
                          #{order.orderId}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusMeta.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusMeta.label}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {order.detailOrders.map((item) => (
                        <div
                          key={item.detailOrderId}
                          className="flex justify-between items-center text-sm bg-blue-50/50 px-3 py-2 rounded-lg"
                        >
                          <span className="text-gray-700 font-medium">
                            {item.itemName}{" "}
                            <span className="text-blue-600 font-semibold">
                              ×{item.quantity}
                            </span>
                          </span>
                          <span className="text-gray-800 font-semibold">
                            {(item.price * item.quantity).toLocaleString()} đ
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Special note */}
                    {order.special && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                        <p className="text-xs text-amber-800">
                          <span className="font-semibold">Ghi chú:</span>{" "}
                          {order.special}
                        </p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-blue-100 pt-3 flex justify-between items-center">
                      <span className="text-gray-600 font-semibold">
                        Tổng cộng
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {total.toLocaleString()} đ
                      </span>
                    </div>
                    {/* 👉 Button yêu cầu thanh toán */}
                    {order.oderStatus === "Serving" && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRequestPayment(order.orderId)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                          Yêu cầu thanh toán
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
}
