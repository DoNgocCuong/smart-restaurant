package com.smart_restaurant.demo.dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MomoPaymentRequest {
    private String partnerCode;
    private String requestType;
    private String ipnUrl;
    private String orderId;
    private Long amount;
    private String orderInfo;
    private String requestId;
    private String redirectUrl;
    private String lang;
    private String extraData;
    private String signature;
}
