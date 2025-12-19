package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Order;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TableResponseActive {
    Integer tableId;
    String tableName;
    String section;
    Integer capacity;
    Boolean is_active;
    LocalDateTime createAt;
    LocalDateTime updateAt;
}
