
package com.smart_restaurant.demo.dto.Response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.enums.StatusTable;
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
public class TableResponse {
    Integer tableId;
    String tableName;
    String section;
    Integer capacity;
    Boolean is_active;
    StatusTable statusTable;
    Integer tenantId;
    List<OrderResponse> orders;
    LocalDateTime createAt;
    LocalDateTime updateAt;
}

