package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.MomoPaymentRequest;
import com.smart_restaurant.demo.dto.Response.MomoPaymentResponse;


import java.util.Map;

public interface MomoPaymentService {
    MomoPaymentResponse createQR(String orderId, Long amount, String orderInfo);
}
