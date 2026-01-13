package com.smart_restaurant.demo.dto.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class BestSellerRevenueResponse {
    private String label;
    private String itemName;
    private Double revenue;
}
