package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.TypePaymentResquest;
import com.smart_restaurant.demo.dto.Response.PaymentHistoryResponse;
import com.smart_restaurant.demo.dto.Response.PaymentResponse;
import com.smart_restaurant.demo.entity.Payment;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface PaymentService {
    Payment createPayment(Integer orderId, Long amount, String momoRequestId, String momoOrderId);
    void updatePaymentStatus(Map<String, String> momoResponse, HttpServletResponse response) throws IOException;
    Payment findByOrderId(Integer orderId);
    PaymentResponse updatePaymentType(TypePaymentResquest typePaymentResquest, Integer orderId);
    List<PaymentHistoryResponse> getPaymentHistory(JwtAuthenticationToken jwtAuthenticationToken);
}
