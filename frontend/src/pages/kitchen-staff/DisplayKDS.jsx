import { useState, useEffect, useContext } from "react";
import {
  RefreshCw,
  Clock,
  AlertCircle,
  Flame,
  Check,
  Sparkles,
} from "lucide-react";
import useKitchenWebSocket from "../../hooks/useKitchenWebSocket";
import orderApi from "../../api/orderApi";
import itemApi from "../../api/itemApi";
import { getTableNameById } from "../../utils/tableUtils";
import KDSHeader from "../../components/kitchen-staff/KDSHeader";
import toast from "react-hot-toast";

function DisplayKDS() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tableNames, setTableNames] = useState({});
  const [itemMap, setItemMap] = useState({});

  const { notifications } = useKitchenWebSocket({
    serverPort: import.meta.env.VITE_SERVER_PORT,
  });

  useEffect(() => {
    if (!notifications.length) return;

    const latest = notifications[0];

    toast.success(`Có đơn hàng mới tại bàn ${latest.tableId}`, {
      id: `order-${latest.orderId}`,
      duration: 4500,
    });

    fetchApprovedOrders();
  }, [notifications]);

  const fetchApprovedOrders = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const response = await orderApi.tenantGetAllOrder();

      const approvedOrders = response.result
        .filter(
          (order) =>
            order.oderStatus === "Approved" ||
            order.oderStatus === "Cooking" ||
            order.oderStatus === "Cooked",
        )
        .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

      setOrders(approvedOrders);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadTableName = async (tableId) => {
    if (!tableId || tableNames[tableId]) return;

    try {
      const name = await getTableNameById(tableId);
      setTableNames((prev) => ({
        ...prev,
        [tableId]: name,
      }));
    } catch (err) {
      console.error("Lỗi lấy tên bàn:", err);
    }
  };

  const fetchKitchenItems = async () => {
    const res = await itemApi.getAllItems(0, 1000);
    const items = res.result.content || [];

    const map = {};
    items.forEach((item) => {
      if (item.isKitchen) {
        map[item.itemId] = item;
      }
    });

    setItemMap(map);
  };

  useEffect(() => {
    fetchApprovedOrders();
    fetchKitchenItems();
  }, []);

  useEffect(() => {
    orders.forEach((order) => {
      loadTableName(order.tableId);
    });
  }, [orders]);

  const handleConfirmAndCook = async (orderId) => {
    try {
      await orderApi.updateStatus(orderId, { status: "Cooking" });
      fetchApprovedOrders();
      fetchKitchenItems();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      setError("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleMarkCooked = async (orderId) => {
    try {
      await orderApi.updateStatus(orderId, { status: "Cooked" });
      fetchApprovedOrders();
      fetchKitchenItems();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      setError("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const calculateTotal = (detailOrders) => {
    return detailOrders.reduce((sum, detail) => {
      const itemTotal =
        detail.price * detail.quantity +
        detail.modifiers.reduce((modSum, mod) => modSum + mod.price, 0) *
          detail.quantity;
      return sum + itemTotal;
    }, 0);
  };

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h`;
  };

  const renderActionButton = (order) => {
    const getButtonColors = (status) => {
      switch (status) {
        case "Approved":
          return {
            bg: "bg-blue-600",
            hover: "hover:bg-blue-700",
            text: "text-white",
            icon: Check,
          };
        case "Cooking":
          return {
            bg: "bg-orange-600",
            hover: "hover:bg-orange-700",
            text: "text-white",
            icon: Check,
          };
        case "Cooked":
          return {
            bg: "bg-green-100",
            hover: "hover:bg-green-200",
            text: "text-green-700",
            icon: Sparkles,
            disabled: true,
          };
        default:
          return null;
      }
    };

    const colors = getButtonColors(order.oderStatus);
    if (!colors) return null;

    const Icon = colors.icon;

    if (colors.disabled) {
      return (
        <button
          disabled
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${colors.bg} ${colors.text} border border-green-200 cursor-not-allowed opacity-60`}
        >
          <Icon size={16} strokeWidth={2} />
          Nấu xong
        </button>
      );
    }

    const actionText =
      order.oderStatus === "Approved" ? "Xác nhận & Nấu" : "Đánh dấu nấu xong";
    const onClick =
      order.oderStatus === "Approved"
        ? () => handleConfirmAndCook(order.orderId)
        : () => handleMarkCooked(order.orderId);

    return (
      <button
        onClick={onClick}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${colors.bg} ${colors.hover} ${colors.text} shadow-md hover:shadow-lg disabled:opacity-50`}
      >
        <Icon size={16} strokeWidth={2} />
        {actionText}
      </button>
    );
  };

  const getColumnOrders = (status) => {
    return orders.filter((o) => o.oderStatus === status);
  };

  const tabList = [
    {
      id: "Approved",
      label: "Đã duyệt",
      bgColor: "bg-amber-500",
      textColor: "text-amber-500",
      borderColor: "border-l-4 border-amber-500",
      count: orders.filter((o) => o.oderStatus === "Approved").length,
    },
    {
      id: "Cooking",
      label: "Đang nấu",
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
      borderColor: "border-l-4 border-blue-500",
      count: orders.filter((o) => o.oderStatus === "Cooking").length,
    },
    {
      id: "Cooked",
      label: "Đã nấu xong",
      bgColor: "bg-green-500",
      textColor: "text-green-500",
      borderColor: "border-l-4 border-green-500",
      count: orders.filter((o) => o.oderStatus === "Cooked").length,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <KDSHeader onRefresh={fetchApprovedOrders} loading={loading} />

      {/* ERROR */}
      {error && (
        <div className="px-6 lg:px-8 pt-6">
          <div className="max-w-full p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <RefreshCw
                size={32}
                className="text-blue-600 animate-spin"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* COLUMNS LAYOUT */}
      {!loading && (
        <div className="px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tabList.map((tab) => {
              const columnOrders = getColumnOrders(tab.id);
              return (
                <div
                  key={tab.id}
                  className="flex flex-col h-[calc(100vh-140px)] bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                >
                  {/* Column Header */}
                  <div
                    className={`${tab.bgColor} px-5 py-3 flex justify-between items-center text-white`}
                  >
                    <h2 className="font-semibold text-sm">{tab.label}</h2>

                    <div className="bg-white px-2.5 py-1 rounded-md">
                      <span
                        className={`font-extrabold text-sm ${tab.textColor}`}
                      >
                        {tab.count}
                      </span>
                    </div>
                  </div>

                  {/* Orders Container */}
                  <div className="flex-1 overflow-y-auto">
                    {columnOrders.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-sm">Không có đơn hàng</p>
                      </div>
                    ) : (
                      <div className="space-y-3 p-4">
                        {columnOrders.map((order) => (
                          <div
                            key={order.orderId}
                            className={`bg-white rounded-lg p-4 border-l-4 ${tab.borderColor} transition-all hover:shadow-md`}
                          >
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-3 gap-2">
                              <h3 className="text-base font-bold text-gray-900">
                                #{order.orderId}
                              </h3>
                              <div className="bg-red-500 text-white px-2.5 py-1 rounded text-xs font-semibold">
                                {tableNames[order.tableId] ||
                                  `Bàn ${order.tableId}`}
                              </div>
                            </div>

                            {/* New Badge */}
                            {newOrderIds.has(order.orderId) && (
                              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1">
                                <Flame size={12} className="text-blue-600" />
                                <span className="text-xs font-bold text-blue-700">
                                  MỚI
                                </span>
                              </div>
                            )}

                            {/* Special Notes */}
                            {tab.id === "Cooking" && order.special && (
                              <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
                                <p className="text-orange-800 text-xs font-semibold flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  {order.special}
                                </p>
                              </div>
                            )}

                            {/* Time Elapsed */}
                            {tab.id === "Cooking" && (
                              <div className="mb-3 text-orange-600 text-xs flex items-center gap-1 font-medium">
                                <Clock size={12} />
                                {getTimeElapsed(order.createAt)}
                              </div>
                            )}

                            {/* Items */}
                            <div className="space-y-2 mb-3">
                              {order.detailOrders.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-gray-800 text-sm"
                                >
                                  <div className="bg-blue-600 text-white w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0">
                                    {item.quantity}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {item.itemName}
                                    </p>
                                    {item.modifiers &&
                                      item.modifiers.length > 0 && (
                                        <p className="text-gray-500 text-xs line-clamp-1">
                                          +{" "}
                                          {item.modifiers
                                            .map((m) => m.name || "")
                                            .join(", ")}
                                        </p>
                                      )}
                                  </div>
                                  <Check
                                    size={16}
                                    className="text-green-500 shrink-0"
                                    strokeWidth={2.5}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Total */}
                            <div className="mb-3 p-2.5 rounded-lg bg-gray-100 text-gray-800 text-center font-bold text-sm">
                              {calculateTotal(
                                order.detailOrders,
                              ).toLocaleString("vi-VN")}{" "}
                              đ
                            </div>

                            {/* Action Button */}
                            {renderActionButton(order)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayKDS;
