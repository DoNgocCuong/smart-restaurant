package com.smart_restaurant.demo.Service;


import com.smart_restaurant.demo.dto.Response.InvoiceResponse;


import com.smart_restaurant.demo.dto.Request.DetailOrderRequest;

import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Request.UpdateDetailOrderRequest;
import com.smart_restaurant.demo.dto.Request.UpdateOrderStatusRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.Order;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.List;

public interface OrderService {
    InvoiceResponse createInvoice(Integer orderId ,JwtAuthenticationToken jwtAuthenticationToken);

    OrderResponse createOrder(OrderRequest orderRequest, JwtAuthenticationToken jwtAuthenticationToken);
    List<OrderResponse> getAllMyOrder(JwtAuthenticationToken jwtAuthenticationToken);
    List<OrderResponse> getAllTenantOrder(JwtAuthenticationToken jwtAuthenticationToken);
    OrderResponse getOrderById(Integer id);
    List<OrderResponse> getAllOrderTenantStatusPendingApproval(JwtAuthenticationToken jwtToken);
    Order getOrderEntityById(Integer id);
    List<OrderResponse> getAllOrderTenantStatusPendingApprovalByStaff(JwtAuthenticationToken jwtToken);
    List<OrderResponse> getAllTenantOrderByStaff(JwtAuthenticationToken jwtAuthenticationToken);


    byte[] generateInvoicePdf(Integer orderId,JwtAuthenticationToken jwtAuthenticationToken);

    OrderResponse updateOrderStatus(Integer id, @RequestBody UpdateOrderStatusRequest updateOrderStatusRequest);
    OrderResponse updateOrderAddItems(Integer orderId, List<UpdateDetailOrderRequest> detailOrderRequests, JwtAuthenticationToken jwtAuthenticationToken);

}
