package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.TypePayment;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PaymentHistoryResponse {
    Integer paymentId;
    Double amount;
    LocalDateTime createAt;
    TypePayment typePayment;
}
