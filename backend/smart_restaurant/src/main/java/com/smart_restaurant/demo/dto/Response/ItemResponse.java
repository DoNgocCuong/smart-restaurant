package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.ModifierGroup;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ItemResponse {
    Integer itemId;
    String itemName;
    String description;
    Double price;
    String avatarUrl;
    boolean status;
    Boolean isKitchen;
    List<CategoryResponse> category;
    List<ModifierGroupResponse> modifierGroup;
}
