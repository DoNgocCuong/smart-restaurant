package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.enums.StatusTable;
import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RestaurantTableResponse {
    Integer tableId;
    String tableName;
    String section;
    Integer capacity;
    Boolean is_active;
    StatusTable statusTable;
}
