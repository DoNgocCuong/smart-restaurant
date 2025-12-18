package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Order;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TableResponse {
    String tableName;
    Integer capacity;
    Boolean is_active;
    Integer tenantId;
    List<Order> orders;
}
