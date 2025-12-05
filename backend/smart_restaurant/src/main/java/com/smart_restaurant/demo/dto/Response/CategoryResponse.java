package com.smart_restaurant.demo.dto.Response;


import com.smart_restaurant.demo.entity.Tenant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CategoryResponse {
    Integer categoryId;
    String categoryName;
    Tenant tenant;
}
