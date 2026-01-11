import { useEffect, useState, useRef } from "react";
import {
  Bell,
  UtensilsCrossed,
  X,
  Check,
  XCircle,
  Clock,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/* ===== STATUS CONFIG ===== */
const STATUS_META = {
  Paid: {
    label: "Đã thanh toán",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Check,
  },
  Pending_payment: {
    label: "Chờ thanh toán",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Clock,
  },
  Pending_approval: {
    label: "Chờ duyệt",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  Approved: {
    label: "Đã duyệt",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Check,
  },
  Cooking: {
    label: "Đang nấu",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: ChefHat,
  },
  Cooked: {
    label: "Đã nấu xong",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Sparkles,
  },
  Serving: {
    label: "Đang phục vụ",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: UtensilsCrossed,
  },
  Rejected: {
    label: "Từ chối",
    color: "bg-gray-50 text-gray-600 border-gray-200",
    icon: XCircle,
  },
};

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState(false);
  const wsRef = useRef(null);

  /* ===== INIT ===== */
  useEffect(() => {
    fetchOrders();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.deactivate();
      }
    };
  }, []);

  /* ===== MOCK DATA FOR DEMO ===== */
  const fetchOrders = async () => {
    // Simulating API call with mock data
    setTimeout(() => {
      setOrders([
        {
          orderId: 1001,
          tableId: 5,
          oderStatus: "Pending_approval",
          createAt: new Date().toISOString(),
          special: "Không hành, ít cay",
          detailOrders: [
            {
              detailOrderId: 1,
              itemName: "Phở bò đặc biệt",
              quantity: 2,
              modifiers: [{ name: "Thêm trứng" }, { name: "Thêm thịt" }],
            },
            {
              detailOrderId: 2,
              itemName: "Cà phê sữa đá",
              quantity: 1,
              modifiers: [],
            },
          ],
        },
        {
          orderId: 1002,
          tableId: 3,
          oderStatus: "Cooking",
          createAt: new Date(Date.now() - 600000).toISOString(),
          special: null,
          detailOrders: [
            {
              detailOrderId: 3,
              itemName: "Cơm chiên dương châu",
              quantity: 1,
              modifiers: [{ name: "Thêm tôm" }],
            },
          ],
        },
        {
          orderId: 1003,
          tableId: 7,
          oderStatus: "Serving",
          createAt: new Date(Date.now() - 1200000).toISOString(),
          special: null,
          detailOrders: [
            {
              detailOrderId: 4,
              itemName: "Lẩu thái hải sản",
              quantity: 1,
              modifiers: [],
            },
            {
              detailOrderId: 5,
              itemName: "Nước cam ép",
              quantity: 3,
              modifiers: [{ name: "Ít đá" }],
            },
          ],
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const connectWebSocket = () => {
    const socket = new SockJS(
      `http://localhost:${import.meta.env.VITE_SERVER_PORT}/ws`
    );

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("STOMP connected");

      // Subscribe to order topic
      stompClient.subscribe("/topic/order", (message) => {
        try {
          const order = JSON.parse(message.body);
          handleNewOrder(order);
        } catch (err) {
          console.error("Parse order error:", err);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      // toast.error("WebSocket bị lỗi");
    };

    stompClient.activate();
    wsRef.current = stompClient;
  };

  const handleNewOrder = (order) => {
    setOrders((prev) => {
      const index = prev.findIndex((o) => o.orderId === order.orderId);

      if (index !== -1) {
        // Update existing order
        const updated = [...prev];
        updated[index] = order;
        return updated;
      }

      // New order - add to top
      // toast.success("🔔 Có đơn hàng mới");
      return [order, ...prev];
    });
  };

  /* ===== ACTIONS ===== */
  const handleApprove = async (orderId) => {
    setProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, oderStatus: "Approved" } : o
        )
      );

      setSelectedOrder(null);
      // toast.success("Đơn hàng đã được duyệt");
    } catch (err) {
      console.error(err);
      // toast.error("Có lỗi xảy ra");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (orderId) => {
    setProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, oderStatus: "Rejected" } : o
        )
      );

      setSelectedOrder(null);
      // toast.success("Đơn hàng đã bị từ chối");
    } catch (err) {
      console.error(err);
      // toast.error("Có lỗi xảy ra");
    } finally {
      setProcessing(false);
    }
  };

  /* ===== FILTER ===== */
  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.oderStatus === statusFilter);

  const countByStatus = (status) =>
    orders.filter((o) => o.oderStatus === status).length;

  /* ===== UI ===== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* ===== HEADER ===== */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                <UtensilsCrossed size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Dashboard Staff
                </h1>
                <p className="text-slate-500 mt-1">
                  Theo dõi đơn hàng realtime
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <Bell size={18} className="text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Realtime
              </span>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Pending_approval", "Cooking", "Serving", "Paid"].map((s) => {
            const Icon = STATUS_META[s].icon;
            return (
              <div
                key={s}
                className="bg-white rounded-2xl shadow-md shadow-slate-200/50 p-6 border border-slate-100 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    size={24}
                    className={STATUS_META[s].color.split(" ")[1]}
                  />
                  <span className="text-3xl font-bold text-slate-800">
                    {countByStatus(s)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {STATUS_META[s].label}
                </p>
              </div>
            );
          })}
        </div>

        {/* ===== FILTER ===== */}
        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-md shadow-slate-200/50 p-4 border border-slate-100">
          <span className="text-sm font-medium text-slate-600">
            Lọc theo trạng thái:
          </span>
          <select
            className="border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả đơn hàng</option>
            {Object.keys(STATUS_META).map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </div>

        {/* ===== ORDER LIST ===== */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500">Đang tải đơn hàng...</p>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <UtensilsCrossed
              size={48}
              className="mx-auto text-slate-300 mb-4"
            />
            <p className="text-slate-500 font-medium">Không có đơn hàng</p>
          </div>
        )}

        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const meta = STATUS_META[order.oderStatus];
            const Icon = meta.icon;

            return (
              <div
                key={order.orderId}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-2xl shadow-md shadow-slate-200/50 p-6 border-2 border-slate-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-200 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      Order #{order.orderId} – Bàn {order.tableId}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(order.createAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${meta.color}`}
                  >
                    <Icon size={16} />
                    {meta.label}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="border-t-2 border-slate-100 pt-4 space-y-2">
                  {order.detailOrders.slice(0, 2).map((item) => (
                    <div
                      key={item.detailOrderId}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-semibold text-xs">
                        {item.quantity}
                      </span>
                      <strong className="text-slate-700">
                        {item.itemName}
                      </strong>
                      {item.modifiers.length > 0 && (
                        <span className="text-slate-500 text-xs">
                          ({item.modifiers.map((m) => m.name).join(", ")})
                        </span>
                      )}
                    </div>
                  ))}
                  {order.detailOrders.length > 2 && (
                    <p className="text-xs text-slate-400 pl-8">
                      +{order.detailOrders.length - 2} món khác...
                    </p>
                  )}
                </div>

                {/* Special Note */}
                {order.special && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-700 flex items-center gap-2">
                      <span className="text-lg">📝</span>
                      <strong>Ghi chú:</strong> {order.special}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== OVERLAY MODAL ===== */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !processing && setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    Order #{selectedOrder.orderId}
                  </h2>
                  <p className="text-indigo-100 mt-1">
                    Bàn {selectedOrder.tableId} •{" "}
                    {new Date(selectedOrder.createAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <button
                  onClick={() => !processing && setSelectedOrder(null)}
                  disabled={processing}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              {/* Status */}
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-2">Trạng thái</p>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${
                    STATUS_META[selectedOrder.oderStatus].color
                  }`}
                >
                  {(() => {
                    const Icon = STATUS_META[selectedOrder.oderStatus].icon;
                    return <Icon size={16} />;
                  })()}
                  {STATUS_META[selectedOrder.oderStatus].label}
                </span>
              </div>

              {/* Items */}
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-3">Chi tiết món ăn</p>
                <div className="space-y-3">
                  {selectedOrder.detailOrders.map((item) => (
                    <div
                      key={item.detailOrderId}
                      className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg font-bold text-sm">
                        {item.quantity}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">
                          {item.itemName}
                        </p>
                        {item.modifiers.length > 0 && (
                          <p className="text-sm text-slate-500 mt-1">
                            Tùy chọn:{" "}
                            {item.modifiers.map((m) => m.name).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Note */}
              {selectedOrder.special && (
                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    Ghi chú đặc biệt
                  </p>
                  <p className="text-amber-700">{selectedOrder.special}</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Action Buttons */}
            {selectedOrder.oderStatus === "Pending_approval" && (
              <div className="p-6 bg-slate-50 border-t-2 border-slate-100 flex gap-3">
                <button
                  onClick={() => handleReject(selectedOrder.orderId)}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={20} />
                  {processing ? "Đang xử lý..." : "Từ chối"}
                </button>
                <button
                  onClick={() => handleApprove(selectedOrder.orderId)}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={20} />
                  {processing ? "Đang xử lý..." : "Chấp nhận"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
