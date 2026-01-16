import Overlay from "../common/Overlay";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import orderApi from "../../api/orderApi";
import { useState } from "react";

export default function CartModal({
  cart,
  onUpdateQty,
  onClose,
  onOrderSuccess,
  tableId,
}) {
  const safeCart = Array.isArray(cart) ? cart : [];
  const [special, setSpecial] = useState("");
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

    const payload = {
      customerName: "Khách tại quán",
      tableId: Number(tableId),
      special: special.trim(),
      detailOrders: mapCartToDetailOrders(safeCart),
    };
    console.log(JSON.stringify(payload));

    try {
      await orderApi.makeOrder(payload);
      onOrderSuccess?.();
      onClose(); // đóng modal sau khi tạo order
    } catch (err) {
      console.error("Make order failed:", err);
    }
  };

  /* ================== UI ================== */
  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-[95%] overflow-hidden relative">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-6 py-4 shadow-md">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart /> Giỏ hàng
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-red-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="max-h-[420px] overflow-y-auto px-6 py-4 space-y-4">
          {safeCart.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              Giỏ hàng đang trống
            </p>
          )}

          {safeCart.map((c) => (
            <div
              key={c.cartItemId}
              className="border rounded-xl p-4 hover:shadow-sm transition"
            >
              <p className="font-medium">{c.itemName}</p>

              {(c.modifiers || []).map((g) =>
                (g.options || []).map((o) => (
                  <p
                    key={o.modifierOptionId}
                    className="text-sm text-gray-500 ml-2"
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
                    className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-gray-100 transition"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-6 text-center font-medium">
                    {c.quantity}
                  </span>

                  <button
                    onClick={() => onUpdateQty(c.cartItemId, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-gray-100 transition"
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
        <div className="shadow-top px-6 py-4 space-y-3">
          {/* ===== SPECIAL NOTE ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú cho nhà bếp
            </label>
            <textarea
              value={special}
              onChange={(e) => setSpecial(e.target.value)}
              placeholder="Ví dụ: ít cay, không hành, lên món sau 10 phút..."
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-300 
                px-3 py-2 text-sm focus:outline-none 
                focus:ring-2 focus:ring-gray-900/80"
            />
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-gray-900">{total.toLocaleString()}₫</span>
          </div>

          <button
            onClick={handleMakeOrder}
            disabled={safeCart.length === 0}
            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium disabled:opacity-50"
          >
            Đặt món
          </button>
        </div>
      </div>
    </Overlay>
  );
}
