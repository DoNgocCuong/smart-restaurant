package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.dto.Request.OrderNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyNewOrder(OrderNotification noti) {
        messagingTemplate.convertAndSend("/topic/orders", noti);
    }

}
