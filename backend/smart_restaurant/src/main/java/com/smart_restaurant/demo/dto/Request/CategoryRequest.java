package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.Tenant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CategoryRequest {

    String categoryName;
    Tenant tenant;
}
