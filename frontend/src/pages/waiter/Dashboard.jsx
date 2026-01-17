import { useEffect, useState } from "react";
import {
  Bell,
  UtensilsCrossed,
  Check,
  XCircle,
  Clock,
  ChefHat,
  Sparkles,
  Clock3,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import StaffDetailOrder from "../../components/waiter/StaffDetailOrder";
import tenantApi from "../../api/tenantApi";
import orderApi from "../../api/orderApi";
import useOrderWebSocket from "../../hooks/useOrderWebSocket";
import toast from "react-hot-toast";
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
  const [tenant, setTenant] = useState(null);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  /* ===== USER ===== */
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) setUserName(storedUserName);
  }, []);

  /* ===== INIT DATA ===== */
  useEffect(() => {
    fetchTenantProfile();
    fetchOrders();
  }, []);

  /* ===== WEBSOCKET (HOOK) ===== */
  const { notifications, newOrderIds, clearNewOrder, removeNotification } =
    useOrderWebSocket({
      serverPort: import.meta.env.VITE_SERVER_PORT,
      onOrderUpdate: (order) => {
        fetchOrders();
      },
    });

  /* ===== API ===== */
  const fetchTenantProfile = async () => {
    try {
      const res = await tenantApi.getTenantProfile();
      setTenant(res.result);
    } catch (err) {
      console.error("Tenant error:", err);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.tenantGetAllOrder();

      const sorted = (res.result || []).sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt),
      );

      setOrders(sorted);
    } catch (err) {
      console.error("Get orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===== ACTIONS ===== */
  const handleApprove = async (orderId) => {
    setProcessing(true);
    try {
      await orderApi.updateStatus(orderId, { status: "Approved" });
      setSelectedOrder(null);
      clearNewOrder(orderId);
      fetchOrders();
    } catch (err) {
      console.error("Approve order error:", err);
      alert("Duyệt đơn thất bại");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (orderId) => {
    setProcessing(true);
    try {
      await orderApi.updateStatus(orderId, { status: "Rejected" });
      setSelectedOrder(null);
      clearNewOrder(orderId);
      fetchOrders();
    } catch (err) {
      console.error("Reject order error:", err);
      alert("Từ chối đơn thất bại");
    } finally {
      setProcessing(false);
    }
  };

  const handleReciveAndServing = async (orderId) => {
    try {
      await orderApi.updateStatus(orderId, { status: "Serving" });
      toast.success("Đang tiến hành phục vụ đơn hàng");
      setSelectedOrder(null);
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      setError("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleOrderClick = (order) => {
    clearNewOrder(order.orderId);
    setSelectedOrder(order);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userName");
      navigate("/login");
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* ===== HEADER ===== */}
        <div className="p-4 bg-white rounded-3xl shadow sm:p-6">
          <div className="flex flex-col justify-between items-center gap-4 lg:flex-row">
            <div className="flex items-start gap-4 sm:items-center">
              <div className="overflow-hidden w-14 h-14 bg-slate-100 rounded-2xl shrink-0 sm:w-16">
                {tenant?.logoUrl ? (
                  <img
                    src={tenant.logoUrl}
                    alt={tenant.nameTenant}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white bg-linear-to-br from-indigo-500 to-indigo-600">
                    <UtensilsCrossed size={28} />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                  {tenant?.nameTenant || "Dashboard Staff"}
                </h1>
                <p className="text-sm text-slate-500">
                  Theo dõi đơn hàng realtime
                </p>
                {tenant && (
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 size={14} />
                    {tenant.openHours} – {tenant.closeHours}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl">
                <User size={16} />
                <span className="text-sm font-medium">
                  {userName || "Staff"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== NOTIFICATIONS ===== */}
        {notifications.length > 0 && (
          <div className="z-40 fixed top-4 right-4 max-w-sm space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-4 text-white bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg animate-slide-in"
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bell size={20} className="animate-bounce" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{notif.message}</p>
                  <p className="mt-1 text-xs opacity-90">
                    Vừa xong - Order #{notif.orderId}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["Pending_approval", "Cooking", "Serving", "Paid"].map((s) => {
            const Icon = STATUS_META[s].icon;
            return (
              <div key={s} className="p-6 bg-white rounded-2xl shadow">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${STATUS_META[s].color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-3xl font-bold">{countByStatus(s)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {STATUS_META[s].label}
                </p>
              </div>
            );
          })}
        </div>

        {/* ===== LIST ===== */}
        {loading && <p>Đang tải đơn hàng...</p>}

        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const meta = STATUS_META[order.oderStatus];
            const Icon = meta?.icon || Bell;
            const isNew = newOrderIds.has(order.orderId);

            return (
              <div
                key={order.orderId}
                onClick={() => handleOrderClick(order)}
                className={`bg-white rounded-2xl p-6 shadow cursor-pointer hover:shadow-md transition-all duration-200 relative overflow-hidden ${
                  isNew
                    ? "ring-2 ring-indigo-500 animate-pulse-border"
                    : "hover:bg-gray-50"
                }`}
              >
                {isNew && (
                  <div className="z-100 absolute top-3 right-3">
                    <span className="px-3 py-1 text-white text-xs font-bold bg-linear-to-r from-indigo-500 to-purple-600 rounded-full animate-bounce">
                      MỚI
                    </span>
                  </div>
                )}

                {isNew && (
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                )}

                <div className="z-10 relative flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${meta?.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <strong className="text-lg">
                        Order #{order.orderId}
                      </strong>
                      <p className="text-sm text-slate-500">
                        Bàn {order.tableId}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-xl border font-medium ${meta?.color}`}
                  >
                    {meta?.label}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && !loading && (
            <div className="py-12 text-center text-slate-400">
              <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-50" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <StaffDetailOrder
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onServing={handleReciveAndServing}
          processing={processing}
        />
      )}
    </div>
  );
}

export default Dashboard;
