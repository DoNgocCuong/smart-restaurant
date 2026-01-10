package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.enums.OrderStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateOrderStatusRequest {
    OrderStatus status;
}
