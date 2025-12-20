import { useEffect, useState } from "react";
import { Plus, Minus, X } from "lucide-react";
import Overlay from "../common/Overlay";
import toast from "react-hot-toast";
export default function CartModal({ items, onClose, onAdd, onRemove }) {
  const [cart, setCart] = useState({});

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : {});
  }, []);

  // Sync when cart changes (same tab)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedCart = localStorage.getItem("cart");
      setCart(storedCart ? JSON.parse(storedCart) : {});
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const cartItems = Object.keys(cart)
    .map((itemId) => {
      const item = items.find((i) => i.item_id === itemId);
      return item ? { ...item, quantity: cart[itemId] } : null;
    })
    .filter(Boolean);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    const storedCart = localStorage.getItem("cart");
    if (!storedCart) return;

    const cartData = JSON.parse(storedCart);

    // Convert cart object -> order items array
    const orderItems = Object.keys(cartData).map((itemId) => {
      const item = items.find((i) => i.item_id === itemId);
      return {
        item_id: itemId,
        item_name: item?.item_name,
        price: item?.price,
        quantity: cartData[itemId],
        total: item?.price * cartData[itemId],
      };
    });

    const orderPayload = {
      items: orderItems,
      totalAmount: orderItems.reduce((sum, item) => sum + item.total, 0),
      createdAt: new Date().toISOString(),
    };

    console.log("ORDER PAYLOAD 👉", orderPayload);

    /* ===== CALL API HERE =====
  await createOrder(orderPayload);
  */

    // Clear cart
    localStorage.removeItem("cart");
    setCart({});
    toast.success("Đặt món thành công");
    // Close modal
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white w-[90vw] max-w-md rounded-xl shadow-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">🛒 Giỏ hàng</h2>
          <button
            onClick={onClose}
            className="cursor-pointer hover:bg-red-100 rounded-sm"
          >
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
                key={item.item_id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{item.item_name}</p>
                  <p className="text-sm text-gray-500">
                    {item.price.toLocaleString()} đ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemove(item.item_id)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <button
                    onClick={() => onAdd(item.item_id)}
                    className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer hover:bg-gray-800"
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
              onClick={() => handleOrder()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium cursor-pointer"
            >
              Đặt món
            </button>
          </div>
        )}
      </div>
    </Overlay>
  );
}
