package com.smart_restaurant.demo.dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class DetailOrderRequest {
    private Integer itemId;
    private Integer quantity;
    private List<Integer> modifierOptionIds;
}
