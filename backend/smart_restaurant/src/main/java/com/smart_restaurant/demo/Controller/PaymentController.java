package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.PaymentService;
import com.smart_restaurant.demo.dto.Request.TypePaymentResquest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.PaymentResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;
    @PutMapping("/{orderId}")
    public ApiResponse<PaymentResponse> updateTypePayment(@RequestBody TypePaymentResquest typePaymentResquest, @PathVariable Integer orderId){
        return  ApiResponse.<PaymentResponse>builder()
                .result(paymentService.updatePaymentType(typePaymentResquest,orderId))
                .build();
    }
}
