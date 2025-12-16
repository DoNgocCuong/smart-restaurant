package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.ModifierGroup;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ItemRequest {

    @NotBlank(message = "Tên món không được để trống")
    String itemName;

    @Size(min = 6, message = "Mô tả phải có ít nhất 6 ký tự")
    String description;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    Double price;

    @NotBlank(message = "Ảnh không được để trống")
    String imageUrl;
    boolean status;

    @NotEmpty(message = "Phải chọn ít nhất một category")
    List<Integer> categoryIds;
    List<Integer> modifierGroupIds;
}
