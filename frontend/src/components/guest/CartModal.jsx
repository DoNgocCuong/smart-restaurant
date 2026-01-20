import Overlay from "../common/Overlay";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
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

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (orderId) {
        const status = await getOrderStatusById(orderId);
        setOrderStatus(status);
      }
    };
    fetchOrderStatus();
  }, [orderId]);

  useEffect(() => {
    console.log(isGuestTenant);
  }, []);

  /* ================== TÍNH GIÁ ================== */
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

  /* ================== MAP CART → API ================== */
  const mapCartToDetailOrders = (cart) =>
    cart.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      modifierOptionIds: (item.modifiers || [])
        .flatMap((g) => g.options || [])
        .map((o) => o.modifierOptionId),
    }));

  /* ================== MERGE ITEM CŨ + MỚI ================== */
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

  /* ================== MAKE / UPDATE ORDER ================== */
  const handleSubmit = async () => {
    if (safeCart.length === 0) return;

    // ===== GỌI THÊM MÓN =====
    if (
      orderId &&
      orderStatus !== "Pendding_payment" &&
      orderStatus !== "Paid"
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
      }

      return;
    }

    // ===== TẠO ORDER MỚI =====
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
      onOrderSuccess?.(safeCart, res?.result?.orderId);
      toast.success("Đơn hàng được gửi đi, vui lòng chờ nhân viên xử lý!");
      onClose();
    } catch (err) {
      if (err?.response?.data?.message === "TABLE_ALREADY_HAS_ORDER") {
        toast.error("Bàn đang có đơn hàng chưa xử lý");
      } else {
        toast.error("Lỗi không thể tạo đơn hàng");
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
                )),
              )}

              <div className="flex items-center justify-between mt-3">
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

                <span className="font-semibold">
                  {calcItemTotal(c).toLocaleString()}₫
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="px-6 py-4 shadow-top space-y-3">
          {isGuestTenant && !orderId && (
            <div className="space-y-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tên khách hàng *"
                className="px-3 py-2 w-full text-sm rounded-xl border"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại *"
                className="px-3 py-2 w-full text-sm rounded-xl border"
              />
            </div>
          )}

          <textarea
            value={special}
            onChange={(e) => setSpecial(e.target.value)}
            placeholder="Ghi chú cho nhà bếp"
            rows={3}
            className="px-3 py-2 w-full text-sm rounded-xl border resize-none"
          />

          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()}₫</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={safeCart.length === 0}
            className="py-3 w-full text-white font-medium bg-gray-900 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            {orderId ? "Gọi thêm món" : "Đặt món"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
