package com.smart_restaurant.demo.dto.Response;


import com.smart_restaurant.demo.entity.Customer;
import com.smart_restaurant.demo.entity.Item;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ReviewResponse {
    Integer reviewId;
    String message;
    Boolean isActive;
    LocalDateTime createAt;
    LocalDateTime updateAt;
    CustomerResponse customer;
    ItemResponseDTO item;


}
