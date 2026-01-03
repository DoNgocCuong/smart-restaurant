package com.smart_restaurant.demo.dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class DetailOrderResponse {
    private Integer detailOrderId;
    private Integer itemId;
    private String itemName;
    private Integer quantity;
    private Double price;
    private List<ModifierOptionResponse> modifiers;
}
