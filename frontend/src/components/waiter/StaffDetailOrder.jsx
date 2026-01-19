import { useEffect, useState } from "react";
import {
  X,
  Check,
  XCircle,
  Clock3,
  User,
  Utensils,
  AlertCircle,
  HandPlatter,
  CheckCheck,
} from "lucide-react";
import { STATUS_META } from "../../utils/statusMeta";
import { getTableNameById } from "../../utils/tableUtils";
import Overlay from "../common/Overlay";
import orderApi from "../../api/orderApi";
import toast from "react-hot-toast";

const calcItemTotal = (item) => {
  const modifierTotal =
    item.modifiers?.reduce((sum, m) => sum + m.price, 0) || 0;
  return (item.price + modifierTotal) * item.quantity;
};

function StaffDetailOrder({
  order,
  onClose,
  onApprove,
  onApproveMore,
  onReject,
  onServing,
  processing,
  hasUnapprovedItems,
}) {
  const [tableName, setTableName] = useState("");

  if (!order) return null;

  useEffect(() => {
    if (!order?.tableId) return;

    const fetchTableName = async () => {
      try {
        const name = await getTableNameById(order.tableId);
        setTableName(name);
      } catch (err) {
        console.error(err);
        setTableName(`#${order.tableId}`);
      }
    };

    fetchTableName();
  }, [order?.tableId]);

  // Xử lý trường hợp status không tồn tại trong STATUS_META
  const statusMeta = STATUS_META[order.oderStatus] || {
    label: order.oderStatus || "Không rõ",
    color: "bg-gray-50 text-gray-600 border-gray-200",
    icon: AlertCircle,
  };

  const StatusIcon = statusMeta.icon;

  // Xử lý trường hợp detailOrders không tồn tại
  const detailOrders = order.detailOrders || [];

  const subtotal =
    order.subtotal && order.subtotal > 0
      ? order.subtotal
      : detailOrders.reduce((sum, item) => sum + calcItemTotal(item), 0);

  return (
    <Overlay onClose={onClose}>
      <div
        className="overflow-hidden max-w-2xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER ===== */}
        <div className="p-6 bg-linear-to-r from-white to-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-extrabold">
                Order #{order.orderId}
              </h2>
              <div className="mt-3 space-y-2">
                <p className="flex items-center gap-2 text-gray-500 text-sm">
                  <User size={16} strokeWidth={2} />
                  <span className="font-medium">
                    {order.customerName || "Guest"}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-gray-500 text-sm">
                  <Utensils size={16} strokeWidth={2} />
                  <span className="font-medium">Bàn {tableName}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock3 size={16} strokeWidth={2} />
                  <span className="font-medium">
                    {order.createAt
                      ? new Date(order.createAt).toLocaleString("vi-VN")
                      : "Chưa có thời gian"}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => !processing && onClose()}
              disabled={processing}
              className="p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-red-100"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-280px)] space-y-6">
          {/* Status */}
          <div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 ${statusMeta.color}`}
            >
              <StatusIcon size={18} strokeWidth={2.5} />
              {statusMeta.label}
            </span>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-600 tracking-wide uppercase">
              Chi tiết món ăn
            </h3>

            {detailOrders.length > 0 ? (
              <div className="space-y-3">
                {detailOrders.map((item, index) => {
                  const itemTotal = calcItemTotal(item);

                  return (
                    <div
                      key={item.detailOrderId || index}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        item.isApproved === false
                          ? "bg-linear-to-r from-amber-50 to-white border-amber-200 hover:border-amber-300"
                          : "bg-linear-to-r from-blue-50 to-white border-blue-100 hover:border-blue-300"
                      } hover:shadow-md`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {item.itemName || "Món ăn"}
                            </p>
                            {item.isApproved === false && (
                              <span className="px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-full">
                                Chưa duyệt
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.quantity || 0} ×{" "}
                            {(item.price || 0).toLocaleString()}đ
                          </p>
                        </div>

                        <p
                          className={`font-bold text-lg ${
                            item.isApproved === false
                              ? "text-amber-600"
                              : "text-blue-600"
                          }`}
                        >
                          {itemTotal.toLocaleString()}đ
                        </p>
                      </div>

                      {/* Modifiers */}
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div
                          className={`mt-3 pt-3 border-t space-y-2 ${
                            item.isApproved === false
                              ? "border-amber-100"
                              : "border-blue-100"
                          }`}
                        >
                          {item.modifiers.map((m, mIndex) => (
                            <div
                              key={m.modifierOptionId || mIndex}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className={
                                    item.isApproved === false
                                      ? "text-amber-500"
                                      : "text-blue-500"
                                  }
                                >
                                  +
                                </span>
                                <span>
                                  {m.modifierGroupName}:{" "}
                                  <span className="font-medium">{m.name}</span>
                                </span>
                              </span>
                              <span
                                className={`font-semibold ${
                                  item.isApproved === false
                                    ? "text-amber-600"
                                    : "text-blue-600"
                                }`}
                              >
                                +{(m.price || 0).toLocaleString()}đ
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-lg border-slate-200 border">
                <p className="text-gray-400 font-medium">Chưa có món ăn nào</p>
              </div>
            )}
          </div>

          {/* Special note */}
          {order.special && (
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
              <p className="flex items-center gap-2 mb-2 text-sm font-bold text-amber-900">
                📝 Ghi chú đặc biệt
              </p>
              <p className="text-amber-700 text-sm">{order.special}</p>
            </div>
          )}

          {/* ===== TOTAL ===== */}
          <div className="pt-4 bg-linear-to-r from-blue-50 to-white border-t border-blue-100">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-700">Tổng cộng</span>
              <span className="text-2xl font-extrabold text-blue-600">
                {subtotal.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        {order.oderStatus === "Pending_approval" && (
          <div className="flex flex-col md:flex-row gap-3 p-6 bg-white border-t border-blue-100">
            <button
              onClick={() => onReject(order.orderId)}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-red-600 font-semibold bg-white border-2 border-red-300 rounded-lg transition-all duration-200 hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle size={20} strokeWidth={2} />
              {processing ? "Đang xử lý..." : "Từ chối"}
            </button>

            <button
              onClick={() => onApprove(order.orderId)}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold 
              bg-linear-to-r from-blue-600 to-blue-700 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 
              hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Check size={20} strokeWidth={2.5} />
              {processing ? "Đang xử lý..." : "Chấp nhận"}
            </button>
          </div>
        )}

        {/* ===== APPROVE MORE BUTTON ===== */}
        {hasUnapprovedItems && (
          <div className="p-6 bg-white border-t border-amber-100">
            <button
              onClick={() => onApproveMore(order.orderId)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold 
              bg-linear-to-r from-amber-600 to-amber-700 rounded-lg transition-all duration-200 hover:from-amber-700 hover:to-amber-800 
              hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck size={20} strokeWidth={2.5} />
              {processing ? "Đang xử lý..." : "Duyệt thêm món"}
            </button>
          </div>
        )}

        {/* ===== COOKED ===== */}
        {order.oderStatus === "Cooked" && (
          <div className="p-6 bg-white border-t border-emerald-100">
            <button
              onClick={() => onServing(order.orderId)}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold 
              bg-linear-to-r from-emerald-600 to-emerald-700 rounded-lg transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 
              hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HandPlatter size={20} strokeWidth={2.5} />
              {processing ? "Đang xử lý..." : "Nhận món và phục vụ"}
            </button>
          </div>
        )}
      </div>
    </Overlay>
  );
}

export default StaffDetailOrder;
