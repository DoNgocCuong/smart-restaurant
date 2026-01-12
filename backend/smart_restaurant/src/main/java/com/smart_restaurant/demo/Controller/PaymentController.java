package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.PaymentService;
import com.smart_restaurant.demo.dto.Request.TypePaymentResquest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.PaymentHistoryResponse;
import com.smart_restaurant.demo.dto.Response.PaymentResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;
    //customer
    @PutMapping("/{orderId}")
    public ApiResponse<PaymentResponse> updateTypePayment(@RequestBody TypePaymentResquest typePaymentResquest, @PathVariable Integer orderId){
        return  ApiResponse.<PaymentResponse>builder()
                .result(paymentService.updatePaymentType(typePaymentResquest,orderId))
                .build();
    }
    //customer
    @GetMapping
    public ApiResponse<List<PaymentHistoryResponse>> getAllPayment(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<List<PaymentHistoryResponse>>builder()
                .result(paymentService.getPaymentHistory(jwtAuthenticationToken))
                .build();
    }

}
