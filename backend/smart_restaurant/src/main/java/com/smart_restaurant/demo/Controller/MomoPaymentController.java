package com.smart_restaurant.demo.Controller;

import com.google.gson.Gson;
import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Service.MomoPaymentService;
import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.Service.PaymentService;
import com.smart_restaurant.demo.constant.MomoParameter;
import com.smart_restaurant.demo.dto.Response.MomoPaymentResponse;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Payment;
import com.smart_restaurant.demo.enums.OrderStatus;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@Slf4j
@RestController
@RequestMapping("/api/momo")
@RequiredArgsConstructor
public class MomoPaymentController {
    @NonFinal
    @Value(("${qr.FE_URL}"))
    protected String fe_url;

    private final MomoPaymentService momoPaymentService;
    private final OrderService orderService;
    private  final PaymentService paymentService;

    @PostMapping("/create")
    public MomoPaymentResponse createQR(@RequestParam Integer orderId, @RequestParam String orderInfo) {
        log.info("Creating MoMo QR for orderId: {}, amount: {}", orderId);

        try {
            // Get order from database
            Order order = orderService.getOrderEntityById(orderId);

            // Kiểm tra order đó trang thái paid hay chua
            if(order.getStatus().getOrderStatus() == OrderStatus.Paid){
                throw new AppException(ErrorCode.ORDER_PAIDED);
            }

            // Get total from order
            Long amount = (long) Math.round(order.getTotal());
            log.info("Order total: {}", amount);


            // Create MoMo QR
            MomoPaymentResponse response = momoPaymentService.createQR(orderId, amount, orderInfo);

            if (response == null || response.getResultCode() != 0) {
                log.error("Failed to create MoMo QR for orderId: {}", orderId);
                throw new AppException(ErrorCode.MOMO_QR_CREATION_FAILED);
            }

            log.info("MoMo QR created successfully for orderId: {}", orderId);
            return response;

        } catch (AppException e) {
            log.error("AppException: {}", e.getErrorCode());
            return MomoPaymentResponse.builder()
                    .resultCode(1)
                    .message(e.getErrorCode().getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Error creating MoMo QR: ", e);
            return MomoPaymentResponse.builder()
                    .resultCode(1)
                    .message("System error: " + e.getMessage())
                    .build();
        }

    }

    @PostMapping("/ipn")
    public String ipnHandler(@RequestBody Map<String, String> momoResponse, HttpServletResponse response) {
        log.info("Received MoMo IPN callback: {}", momoResponse);

        try {
            Integer resultCode = Integer.valueOf(momoResponse.get(MomoParameter.RESULT_CODE));
            paymentService.updatePaymentStatus(momoResponse,response);
            return "success";
        } catch (Exception e) {
            log.error("Error processing MoMo IPN: ", e);
            return "error";
        }
    }

    @GetMapping("/return")
    public void returnHandler(
            @RequestParam String orderId,
            @RequestParam Integer resultCode,
            HttpServletResponse response) throws IOException {

        if (resultCode == 0) {
            response.sendRedirect(fe_url + "/paid-successfully");
        } else {
            response.sendRedirect(fe_url + "/payment-failed");
        }
    }

    @GetMapping("/payment-status/{orderId}")
    public Payment getPaymentStatus(@PathVariable Integer orderId) {
        return paymentService.findByOrderId(orderId);
    }


}