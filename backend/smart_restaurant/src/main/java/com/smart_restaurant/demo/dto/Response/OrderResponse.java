package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.enums.OrderStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderResponse {
    private Integer orderId;
    private String customerName;
    private Integer tableId;
    private Float subtotal;
    private LocalDateTime createAt;
    private List<DetailOrderResponse> detailOrders;
    private String special;
    private OrderStatus oderStatus;

}
