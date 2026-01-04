package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.InvoiceResponse;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

//    @PostMapping("")
//    public ApiResponse<OrderResponse> createOrder()
    @PostMapping("/{orderId}")
    public ApiResponse<InvoiceResponse>createInvoice(@PathVariable Integer orderId){
        return ApiResponse.<InvoiceResponse>builder()
                .result(orderService.createInvoice(orderId))
                .build();
    }
}
