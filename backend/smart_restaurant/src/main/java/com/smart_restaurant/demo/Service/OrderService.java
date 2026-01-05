package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.InvoiceResponse;

import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.Order;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface OrderService {
    InvoiceResponse createInvoice(Integer orderId ,JwtAuthenticationToken jwtAuthenticationToken);

    OrderResponse createOrder(OrderRequest orderRequest, JwtAuthenticationToken jwtAuthenticationToken);
    List<OrderResponse> getAllOrder(JwtAuthenticationToken jwtAuthenticationToken);
    List<OrderResponse> getAllTenantOrder(JwtAuthenticationToken jwtAuthenticationToken);
    byte[] generateInvoicePdf(Integer orderId,JwtAuthenticationToken jwtAuthenticationToken);
}
