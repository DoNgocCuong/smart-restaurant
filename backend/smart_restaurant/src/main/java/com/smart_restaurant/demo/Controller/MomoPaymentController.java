package com.smart_restaurant.demo.Controller;

import com.google.gson.Gson;
import com.smart_restaurant.demo.Service.MomoPaymentService;
import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.Service.PaymentService;
import com.smart_restaurant.demo.constant.MomoParameter;
import com.smart_restaurant.demo.dto.Response.MomoPaymentResponse;
import com.smart_restaurant.demo.entity.Payment;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@Slf4j
@RestController
@RequestMapping("/api/momo")
@RequiredArgsConstructor
public class MomoPaymentController {

    private final MomoPaymentService momoPaymentService;
    private final OrderService orderService;
    private  final PaymentService paymentService;

    @PostMapping("/create")
//    public MomoPaymentResponse createQR(String orderId, Long amount, String orderInfo)  {
//        return momoPaymentService.createQR(orderId,amount,orderInfo);
//    }
    public MomoPaymentResponse createQR(
            @RequestParam String orderId,
            @RequestParam Long amount,
            @RequestParam String orderInfo) {

        log.info("Creating MoMo QR for orderId: {}, amount: {}", orderId, amount);
        return momoPaymentService.createQR(orderId, amount, orderInfo);
    }

    @GetMapping("/ipn-handler")
//    public String ipnHandler(@RequestParam Map<String, String> request) {
//        Integer resultCode = Integer.valueOf(request.get(MomoParameter.RESULT_CODE));
//        return resultCode == 0 ? "Giao dich thanh cong" : "Giao dich that bai";
//    }
    public String ipnHandler(@RequestParam Map<String, String> momoResponse) {
        log.info("Received MoMo IPN callback: {}", momoResponse);

        try {
            Integer resultCode = Integer.valueOf(momoResponse.get(MomoParameter.RESULT_CODE));

            // Update payment status in database
            Payment payment = paymentService.updatePaymentStatus(momoResponse);

            if (resultCode == 0) {
                log.info("Payment successful for orderId: {}", payment.getOrder().getOrderId());
                return "success";
            } else {
                log.warn("Payment failed for orderId: {}, reason: {}",
                        payment.getOrder().getOrderId(),
                        momoResponse.get(MomoParameter.MESSAGE));
                return "failed";
            }
        } catch (Exception e) {
            log.error("Error processing MoMo IPN: ", e);
            return "error";
        }
    }

    @GetMapping("/payment-status/{orderId}")
    public Payment getPaymentStatus(@PathVariable Integer orderId) {
        return paymentService.findByOrderId(orderId);
    }


}