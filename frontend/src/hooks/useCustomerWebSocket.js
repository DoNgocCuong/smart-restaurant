import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useCustomerWebSocket({ onCustomerUpdate, serverPort }) {
  const wsRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [newOrderIds, setNewOrderIds] = useState(new Set());

  useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_SERVER_DOMAIN}/ws`);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("Customer WebSocket connected!");

      stompClient.subscribe("/topic/Customer", (message) => {
        const order = JSON.parse(message.body);
        handleCustomerNotification(order);
      });
    };

    stompClient.activate();
    wsRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [serverPort]);

  /* ===== HANDLE NOTIFICATION ===== */
  const handleCustomerNotification = (order) => {
    onCustomerUpdate?.(order);

    if (!order.message) return;

    const notification = {
      id: Date.now(),
      orderId: order.orderId,
      tableId: order.tableId,
      message: order.message,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev]);
    setNewOrderIds((prev) => new Set([...prev, order.orderId]));

    // auto remove sau 10s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 10000);
  };

  /* ===== PUBLIC METHODS ===== */
  const clearNewOrder = (orderId) => {
    setNewOrderIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    newOrderIds,
    clearNewOrder,
    removeNotification,
  };
}
