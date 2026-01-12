import { X, Check, XCircle, Clock3, User, Utensils } from "lucide-react";
import { STATUS_META } from "../../utils/statusMeta";
import Overlay from "../common/Overlay";

const calcItemTotal = (item) => {
  const modifierTotal = item.modifiers.reduce((sum, m) => sum + m.price, 0);
  return (item.price + modifierTotal) * item.quantity;
};

function StaffDetailOrder({ order, onClose, onApprove, onReject, processing }) {
  if (!order) return null;

  const statusMeta = STATUS_META[order.oderStatus];
  const StatusIcon = statusMeta.icon;

  const subtotal =
    order.subtotal && order.subtotal > 0
      ? order.subtotal
      : order.detailOrders.reduce((sum, item) => sum + calcItemTotal(item), 0);

  return (
    <Overlay>
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER ===== */}
        <div className="bg-linear-to-r from-indigo-500 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Order #{order.orderId}</h2>
              <p className="text-indigo-100 mt-1 flex items-center gap-3">
                <User size={16} /> {order.customerName || "Guest"} •{" "}
                <Utensils size={16} /> Bàn {order.tableId}
              </p>
              <p className="text-indigo-100 text-sm mt-1 flex items-center gap-3">
                <Clock3 size={16} />{" "}
                {new Date(order.createAt).toLocaleString("vi-VN")}
              </p>
            </div>

            <button
              onClick={() => !processing && onClose()}
              disabled={processing}
              className="p-2 hover:bg-white/20 rounded-xl disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-260px)]">
          {/* Status */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${statusMeta.color}`}
            >
              <StatusIcon size={16} />
              {statusMeta.label}
            </span>
          </div>

          {/* Items */}
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-3">Chi tiết món ăn</p>

            <div className="space-y-4">
              {order.detailOrders.map((item) => {
                const itemTotal = calcItemTotal(item);

                return (
                  <div
                    key={item.detailOrderId}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.itemName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} × {item.price.toLocaleString()}đ
                        </p>
                      </div>

                      <p className="font-semibold">
                        {itemTotal.toLocaleString()}đ
                      </p>
                    </div>

                    {/* Modifiers */}
                    {item.modifiers.length > 0 && (
                      <div className="mt-2 space-y-1 text-sm text-slate-600">
                        {item.modifiers.map((m) => (
                          <div
                            key={m.modifierOptionId}
                            className="flex justify-between"
                          >
                            <span>
                              ➕ {m.modifierGroupName}: {m.name}
                            </span>
                            <span>+{m.price.toLocaleString()}đ</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special note */}
          {order.special && (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                📝 Ghi chú đặc biệt
              </p>
              <p className="text-amber-700">{order.special}</p>
            </div>
          )}

          {/* ===== TOTAL ===== */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        {order.oderStatus === "Pending_approval" && (
          <div className="p-6 bg-slate-50 border-t-2 border-slate-100 flex gap-3">
            <button
              onClick={() => onReject(order.orderId)}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle size={20} />
              {processing ? "Đang xử lý..." : "Từ chối"}
            </button>

            <button
              onClick={() => onApprove(order.orderId)}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
            >
              <Check size={20} />
              {processing ? "Đang xử lý..." : "Chấp nhận"}
            </button>
          </div>
        )}
      </div>
    </Overlay>
  );
}

export default StaffDetailOrder;
