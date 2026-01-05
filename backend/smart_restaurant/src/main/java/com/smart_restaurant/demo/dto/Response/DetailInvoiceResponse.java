package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Item;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class DetailInvoiceResponse {
    private Integer detailOrderId;
    private Item item;
    private Integer quantity;
    private Double price;
    private List<ModifierOptionResponse> modifiers;
}
