package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.Tenant;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    String categoryName;
}
