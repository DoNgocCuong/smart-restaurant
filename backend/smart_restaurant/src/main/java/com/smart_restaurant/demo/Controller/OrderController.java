package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.InvoiceResponse;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @PostMapping("")
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody OrderRequest orderRequest, @AuthenticationPrincipal JwtAuthenticationToken jwtToken){
        OrderResponse orderResponse = orderService.createOrder(orderRequest, jwtToken);
        return ApiResponse.<OrderResponse>builder()
                .result(orderResponse)
                .message("Tạo order thành cong")
                .build();
    }

    @GetMapping("")
    public ApiResponse<List<OrderResponse>> getAllOrder(JwtAuthenticationToken jwtToken){
        List<OrderResponse> orderResponse = orderService.getAllOrder( jwtToken);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderResponse)
                .message("Get all order thành cong")
                .build();
    }

    @GetMapping("/tenant")
    public ApiResponse<List<OrderResponse>> getAllOrderTenant(JwtAuthenticationToken jwtToken){
        List<OrderResponse> orderResponse = orderService.getAllTenantOrder( jwtToken);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderResponse)
                .message("Get all order thành cong cua nhà hàng")
                .build();
    }


//    @PostMapping("")
//    public ApiResponse<OrderResponse> createOrder()
    @PostMapping("/{orderId}")
    public ApiResponse<InvoiceResponse>createInvoice(@PathVariable Integer orderId,JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<InvoiceResponse>builder()
                .result(orderService.createInvoice(orderId,jwtAuthenticationToken))
                .build();
    }
}
