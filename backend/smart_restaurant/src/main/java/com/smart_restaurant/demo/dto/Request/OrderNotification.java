package com.smart_restaurant.demo.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderNotification {
    private Integer orderId;
    private Integer tableId;
    private String message;
}
