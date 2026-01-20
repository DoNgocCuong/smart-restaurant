import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useKitchenWebSocket({ onKitchenUpdate, serverPort }) {
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
      console.log("Kitchen WebSocket connected!");

      stompClient.subscribe("/topic/kitchens", (message) => {
        const order = JSON.parse(message.body);
        handleNewOrder(order);
      });
    };

    stompClient.activate();
    wsRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [serverPort]);

  /* ===== HANDLE ORDER ===== */
  const handleNewOrder = (order) => {
    onKitchenUpdate?.(order);

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
