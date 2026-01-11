package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.TypePayment;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PaymentResponse {
    Integer paymentId;
    TypePayment typePayment;
}
