package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.ModifierGroup;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ItemRequest {

    String itemName;
    String description;
    Double price;
    String imageUrl;
    boolean status;
    List<Category> categories;
    ModifierGroup modifierGroup;
}
