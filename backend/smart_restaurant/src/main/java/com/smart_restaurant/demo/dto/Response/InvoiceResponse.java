package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.DetailOrder;
import com.smart_restaurant.demo.entity.Payment;
import com.smart_restaurant.demo.entity.RestaurantTable;
import com.smart_restaurant.demo.entity.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InvoiceResponse {
    Integer orderId;
    String customerName;
    String special;
    float discount;
    float subtotal;

    Integer tax;
    Float total;
    String tableName;
    List<DetailOrderResponse> detailOrders;
}
