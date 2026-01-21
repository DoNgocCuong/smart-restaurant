import Overlay from "../common/Overlay";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import orderApi from "../../api/orderApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUsernameFromToken } from "../../utils/jwt";
import { getOrderStatusById } from "../../utils/orderStatus";

export default function CartModal({
  cart,
  orderedItems = [],
  orderId,
  onUpdateQty,
  onClose,
  onOrderSuccess,
  tableId,
}) {
  const safeCart = Array.isArray(cart) ? cart : [];
  const safeOrderedItems = Array.isArray(orderedItems) ? orderedItems : [];

  const [special, setSpecial] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const username = getUsernameFromToken();
  const isGuestTenant = username?.includes("guest_tenant");

  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (orderId) {
        const status = await getOrderStatusById(orderId);
        setOrderStatus(status);
      }
    };
    fetchOrderStatus();
  }, [orderId]);

  const calcItemTotal = (item) => {
    const modifiers = Array.isArray(item.modifiers) ? item.modifiers : [];
    const modifierTotal = modifiers.reduce(
      (sum, g) =>
        sum +
        (Array.isArray(g.options)
          ? g.options.reduce((s, o) => s + o.price, 0)
          : 0),
      0,
    );
    return (item.price + modifierTotal) * item.quantity;
  };

  const total = safeCart.reduce((sum, item) => sum + calcItemTotal(item), 0);

  const mapCartToDetailOrders = (cart) =>
    cart.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      modifierOptionIds: (item.modifiers || [])
        .flatMap((g) => g.options || [])
        .map((o) => o.modifierOptionId),
    }));

  const mergeItems = (oldItems, newItems) => {
    const map = new Map();
    [...oldItems, ...newItems].forEach((item) => {
      const key =
        item.itemId +
        "-" +
        (item.modifiers || [])
          .flatMap((g) => g.options || [])
          .map((o) => o.modifierOptionId)
          .sort()
          .join(",");
      if (map.has(key)) {
        map.get(key).quantity += item.quantity;
      } else {
        map.set(key, { ...item });
      }
    });
    return Array.from(map.values());
  };

  const handleSubmit = async () => {
    if (safeCart.length === 0) return;

    setIsLoading(true);

    if (
      orderId &&
      orderStatus !== "Pendding_payment" &&
      orderStatus !== "Paid" &&
      orderStatus !== "Rejected"
    ) {
      const detailOrders = mapCartToDetailOrders(safeCart);
      const mergedItems = mergeItems(safeOrderedItems, safeCart);

      try {
        await orderApi.customerUpdate(orderId, detailOrders);
        toast.success("Đã gửi thêm món cho nhà bếp");
        onOrderSuccess?.(mergedItems);
        onClose();
      } catch (err) {
        console.error("Update order failed:", err);
        toast.error("Không thể cập nhật đơn hàng");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (isGuestTenant) {
      if (!customerName.trim() || !phone.trim()) {
        toast.error("Vui lòng nhập tên và số điện thoại");
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      customerName: isGuestTenant ? customerName.trim() : "Khách tại quán",
      phone: isGuestTenant ? phone.trim() : "0000000000",
      tableId: Number(tableId),
      special: special.trim(),
      detailOrders: mapCartToDetailOrders(safeCart),
    };

    try {
      const res = await orderApi.makeOrder(payload);
      onOrderSuccess?.(safeCart, res?.result?.orderId);
      toast.success("Đơn hàng được gửi đi, vui lòng chờ nhân viên xử lý!");
      onClose();
    } catch (err) {
      if (err?.response?.data?.message === "TABLE_ALREADY_HAS_ORDER") {
        toast.error("Bàn đang có đơn hàng chưa xử lý");
      } else {
        toast.error("Lỗi không thể tạo đơn hàng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="overflow-hidden relative w-full max-w-[600px] bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[95vh]">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 bg-linear-to-r from-slate-900 to-slate-800 border-b border-slate-700">
          <h3 className="flex items-center gap-3 font-bold text-lg sm:text-xl text-white">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ShoppingCart size={20} />
            </div>
            Giỏ hàng
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors duration-200 text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-3 sm:space-y-4">
          {safeCart.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-base">Giỏ hàng đang trống</p>
            </div>
          ) : (
            safeCart.map((c) => (
              <div
                key={c.cartItemId}
                className="p-4 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md bg-linear-to-br from-white to-gray-50 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base wrap-break-words">
                      {c.itemName}
                    </p>
                  </div>
                  <span className="font-bold text-blue-600 text-sm sm:text-base whitespace-nowrap shrink-0">
                    {calcItemTotal(c).toLocaleString()}₫
                  </span>
                </div>

                {(c.modifiers || []).length > 0 && (
                  <div className="mb-3 ml-1 space-y-1 border-l-2 border-blue-300 pl-3">
                    {(c.modifiers || []).map((g) =>
                      (g.options || []).map((o) => (
                        <p
                          key={o.modifierOptionId}
                          className="text-xs sm:text-sm text-gray-600 flex items-center justify-between"
                        >
                          <span>+ {o.name}</span>
                          <span className="text-gray-400">
                            {o.price.toLocaleString()}₫
                          </span>
                        </p>
                      )),
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQty(c.cartItemId, -1)}
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md hover:bg-white transition-colors duration-200 text-gray-700 active:scale-95"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-5 sm:w-6 text-center font-bold text-sm text-gray-900">
                      {c.quantity}
                    </span>

                    <button
                      onClick={() => onUpdateQty(c.cartItemId, 1)}
                      className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md hover:bg-white transition-colors duration-200 text-gray-700 active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => onUpdateQty(c.cartItemId, -c.quantity)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-500"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4 border-t border-gray-200 bg-gray-50">
          {isGuestTenant && !orderId && (
            <div className="space-y-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tên khách hàng *"
                className="px-4 py-2.5 w-full text-sm rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại *"
                className="px-4 py-2.5 w-full text-sm rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          )}

          <textarea
            value={special}
            onChange={(e) => setSpecial(e.target.value)}
            placeholder="Ghi chú cho nhà bếp (tùy chọn)"
            rows={2}
            className="px-4 py-2.5 w-full text-sm rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
          />

          <div className="flex justify-between items-center py-3 px-4 bg-white rounded-2xl border border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Tổng cộng</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600">
              {total.toLocaleString()}₫
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={safeCart.length === 0 || isLoading}
            className={`w-full py-3 sm:py-3.5 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              safeCart.length === 0 || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl active:scale-95"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                {orderId ? "Gọi thêm món" : "Đặt món"}
              </>
            )}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
