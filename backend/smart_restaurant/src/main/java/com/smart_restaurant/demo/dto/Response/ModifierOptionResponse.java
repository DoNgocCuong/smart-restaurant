package com.smart_restaurant.demo.dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ModifierOptionResponse {
    Integer modifierOptionId;
    String name;
    Double price;
    Integer modifierGroupId;
    String modifierGroupName;
}
