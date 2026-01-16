import Overlay from "../common/Overlay";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import orderApi from "../../api/orderApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { getUsernameFromToken } from "../../utils/jwt";

export default function CartModal({
  cart,
  onUpdateQty,
  onClose,
  onOrderSuccess,
  tableId,
}) {
  const safeCart = Array.isArray(cart) ? cart : [];
  const [special, setSpecial] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const username = getUsernameFromToken();
  const isGuestTenant = username?.includes("guest_tenant");

  /* ================== TÍNH GIÁ ================== */
  const calcItemTotal = (item) => {
    const modifiers = Array.isArray(item.modifiers) ? item.modifiers : [];

    const modifierTotal = modifiers.reduce(
      (sum, g) =>
        sum +
        (Array.isArray(g.options)
          ? g.options.reduce((s, o) => s + o.price, 0)
          : 0),
      0
    );

    return (item.price + modifierTotal) * item.quantity;
  };

  const total = safeCart.reduce((sum, item) => sum + calcItemTotal(item), 0);

  /* ================== MAP CART → API ================== */
  const mapCartToDetailOrders = (cart) => {
    return cart.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      modifierOptionIds: (item.modifiers || [])
        .flatMap((g) => g.options || [])
        .map((o) => o.modifierOptionId),
    }));
  };

  /* ================== MAKE ORDER ================== */
  const handleMakeOrder = async () => {
    if (safeCart.length === 0) return;

    if (isGuestTenant) {
      if (!customerName.trim() || !phone.trim()) {
        toast.error("Vui lòng nhập tên và số điện thoại");
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

      console.log(res);

      onOrderSuccess?.();
      toast.success("Đơn hàng được gửi đi, vui lòng chờ nhân viên xử lý!");
      onClose();
    } catch (err) {
      console.error("Make order failed:", err);
      if (err?.response?.data?.message === "TABLE_ALREADY_HAS_ORDER") {
        toast.error("Bàn đang có đơn hàng chưa xử lý");
      } else {
        toast.error("Lỗi không thể tạo đơn hàng");
        console.error(err?.response?.data?.message);
      }
    }
  };

  /* ================== UI ================== */
  return (
    <Overlay onClose={onClose}>
      <div className="overflow-hidden relative w-[560px] max-w-[95%] bg-white rounded-2xl shadow-2xl">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-6 py-4 shadow-md">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <ShoppingCart /> Giỏ hàng
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md cursor-pointer hover:bg-red-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="overflow-y-auto px-6 py-4 max-h-[420px] space-y-4">
          {safeCart.length === 0 && (
            <p className="py-10 text-center text-gray-400">
              Giỏ hàng đang trống
            </p>
          )}

          {safeCart.map((c) => (
            <div
              key={c.cartItemId}
              className="p-4 rounded-xl border hover:shadow-sm transition"
            >
              <p className="font-medium">{c.itemName}</p>

              {(c.modifiers || []).map((g) =>
                (g.options || []).map((o) => (
                  <p
                    key={o.modifierOptionId}
                    className="ml-2 text-sm text-gray-500"
                  >
                    + {o.name}{" "}
                    <span className="text-gray-400">
                      ({o.price.toLocaleString()}₫)
                    </span>
                  </p>
                ))
              )}

              <div className="flex items-center justify-between mt-3">
                {/* Qty control */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQty(c.cartItemId, -1)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-100 transition"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-6 text-center font-medium">
                    {c.quantity}
                  </span>

                  <button
                    onClick={() => onUpdateQty(c.cartItemId, 1)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-100 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Item total */}
                <span className="font-semibold">
                  {calcItemTotal(c).toLocaleString()}₫
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="px-6 py-4 shadow-top space-y-3">
          {isGuestTenant && (
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Tên khách hàng *
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nhập tên khách hàng"
                  className="px-3 py-2 w-full text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/80"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Số điện thoại *
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="px-3 py-2 w-full text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/80"
                />
              </div>
            </div>
          )}

          {/* ===== SPECIAL NOTE ===== */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ghi chú cho nhà bếp
            </label>
            <textarea
              value={special}
              onChange={(e) => setSpecial(e.target.value)}
              placeholder="Ví dụ: ít cay, không hành, lên món sau 10 phút..."
              rows={3}
              className="px-3 py-2 w-full text-sm rounded-xl border-gray-300 resize-none border focus:outline-none focus:ring-2 focus:ring-gray-900/80"
            />
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-gray-900">{total.toLocaleString()}₫</span>
          </div>

          <button
            onClick={handleMakeOrder}
            disabled={safeCart.length === 0}
            className="py-3 w-full text-white font-medium bg-gray-900 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            Đặt món
          </button>
        </div>
      </div>
    </Overlay>
  );
}
