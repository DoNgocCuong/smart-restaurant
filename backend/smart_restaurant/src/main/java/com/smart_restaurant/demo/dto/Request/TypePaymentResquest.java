package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.enums.PaymentType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TypePaymentResquest {
    String paymentType;
}
