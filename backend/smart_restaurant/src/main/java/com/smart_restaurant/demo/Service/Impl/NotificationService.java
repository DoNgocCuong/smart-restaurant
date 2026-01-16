package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.dto.Response.OrderNotification;
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
    public void notifyAcceptOrderKitchen(OrderNotification notification){
        messagingTemplate.convertAndSend("/topic/kitchens", notification);
    }
    public void notifyAcceptOrderCustomer(OrderNotification notification){
        messagingTemplate.convertAndSend("/topic/Customer", notification);
    }



}
