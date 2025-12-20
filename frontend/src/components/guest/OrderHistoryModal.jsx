import { X, History } from "lucide-react";
import Overlay from "../common/Overlay";
import { useState, useEffect } from "react";
const mock_orders = [
  {
    order_id: "ORD001",
    order_number: "#0001",
    customer_name: "Guest",
    special_note: "Ít cay",
    subtotal: 200000,
    tax: 20000,
    total: 220000,
    status: { status_id: 1, name: "Pending" },
    created_at: "2025-01-10T10:30:00Z",
    items: [
      {
        item_name: "Phở bò đặc biệt",
        quantity: 2,
        price: 85000,
      },
      {
        item_name: "Cà phê sữa đá",
        quantity: 1,
        price: 30000,
      },
    ],
  },
];

export default function OrderHistoryModal({ onClose }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    setOrders(mock_orders);
  }, []);

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white w-[90vw] max-w-xl rounded-xl shadow-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex gap-2">
            <History /> <span>Lịch sử đơn hàng</span>
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-10">
            Chưa có đơn hàng nào
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-auto">
            {orders.map((order) => (
              <div key={order.order_id} className="border rounded-lg p-4">
                {/* Order header */}
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{order.order_number}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <span
                    className={`h-fit text-xs px-3 py-1 rounded-full ${
                      order.status.name == "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    } `}
                  >
                    {order.status.name == "Pending"
                      ? "Đang làm"
                      : "Đang phục vụ"}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1 text-sm">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {item.item_name} x{item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString()} đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span>{order.total.toLocaleString()} đ</span>
                </div>

                {order.special_note && (
                  <p className="text-xs text-gray-500 mt-2">
                    Ghi chú: {order.special_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Overlay>
  );
}
