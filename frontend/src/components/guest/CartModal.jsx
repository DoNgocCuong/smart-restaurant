import { Plus, Minus, X } from "lucide-react";
import Overlay from "../common/Overlay";
import toast from "react-hot-toast";

export default function CartModal({ cart, items, onAdd, onRemove, onClose }) {
  const cartItems = Object.keys(cart)
    .map((itemId) => {
      const item = items.find((i) => i.itemId === Number(itemId));
      return item ? { ...item, quantity: cart[itemId] } : null;
    })
    .filter(Boolean);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    const orderItems = cartItems.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }));

    const orderPayload = {
      items: orderItems,
      totalAmount: totalPrice,
      createdAt: new Date().toISOString(),
    };

    console.log("ORDER PAYLOAD 👉", orderPayload);

    sessionStorage.removeItem("cart");
    toast.success("Đặt món thành công");
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white w-[90vw] max-w-md rounded-xl shadow-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">🛒 Giỏ hàng</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Giỏ hàng đang trống
          </p>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-auto">
            {cartItems.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{item.itemName}</p>
                  <p className="text-sm text-gray-500">
                    {item.price.toLocaleString()} đ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemove(item.itemId)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <button
                    onClick={() => onAdd(item.itemId)}
                    className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t mt-5 pt-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Tổng cộng</span>
              <span className="font-semibold">
                {totalPrice.toLocaleString()} đ
              </span>
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-gray-900 text-white py-3 rounded-xl"
            >
              Đặt món
            </button>
          </div>
        )}
      </div>
    </Overlay>
  );
}
