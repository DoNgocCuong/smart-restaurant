package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.dto.Request.DetailOrderRequest;
import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Request.UpdateDetailOrderRequest;
import com.smart_restaurant.demo.dto.Request.UpdateOrderStatusRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.InvoiceResponse;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;
    SimpMessagingTemplate messagingTemplate;

    @PostMapping("")
    public ApiResponse<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest orderRequest) {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        JwtAuthenticationToken jwtToken =
                (auth instanceof JwtAuthenticationToken)
                        ? (JwtAuthenticationToken) auth
                        : null;

        System.out.println("🔍 JWT Token: " + (jwtToken != null ? "Có" : "Null"));


        // jwtToken sẽ tự động null nếu chưa đăng nhập
        OrderResponse orderResponse = orderService.createOrder(orderRequest, jwtToken);

        return ApiResponse.<OrderResponse>builder()
                .result(orderResponse)
                .message("Tạo order thành công")
                .build();
    }

    // Xem tất cả đơn hàng , xem được luôn chi tiết đơn hàng
    @GetMapping("/me")
    public ApiResponse<List<OrderResponse>> getAllMyOrder(JwtAuthenticationToken jwtToken){
        List<OrderResponse> orderResponse = orderService.getAllMyOrder( jwtToken);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderResponse)
                .message("Get all order thành cong")
                .build();
    }

    // [ Xem chi tiet don hang ]
    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Integer id){
        OrderResponse orderResponse = orderService.getOrderById(id);
        return ApiResponse.<OrderResponse>builder()
                .result(orderResponse)
                .message("Get order thành cong")
                .build();
    }



    // [ Xem don hang cua tent ]
    @GetMapping("/tenant")
    public ApiResponse<List<OrderResponse>> getAllOrderTenant(JwtAuthenticationToken jwtToken){
        List<OrderResponse> orderResponse = orderService.getAllTenantOrder(jwtToken);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderResponse)
                .message("Get all order thành cong cua nhà hàng")
                .build();
    }

    // [ update Order ]
    @PutMapping("/{orderId}")
    public ApiResponse<OrderResponse> updateOrderAddItems(
            @PathVariable Integer orderId,
            @RequestBody List<UpdateDetailOrderRequest> updateDetailOrderRequests,
            JwtAuthenticationToken jwtAuthenticationToken) {

        OrderResponse response = orderService.updateOrderAddItems(orderId, updateDetailOrderRequests, jwtAuthenticationToken);
        return ApiResponse.<OrderResponse>builder()
                .result(response)
                .message("Update thành cong đơn hàng")
                .build();
    }

    /*
    - Staff chấp nhận / từ chối order : [ status = Pending_approval,Approved]
    - Khách hàng yêu cầu thành toán : [ Status = Pending_approval]
     */
    @PatchMapping("/status/{id}")
    public ApiResponse<OrderResponse> updateOrderStatusToPendingPayment(@PathVariable Integer id, @RequestBody UpdateOrderStatusRequest updateOrderStatusRequest){
        OrderResponse orderResponse = orderService.updateOrderStatus(id, updateOrderStatusRequest);
        return ApiResponse.<OrderResponse>builder()
                .result(orderResponse)
                .message("Order yêu cầu thanh toán")
                .build();
    }


    // [STAFF]
    // [1] - Get all đơn hàng cua Nha Hang đang chờ xử lý
    @GetMapping("/tenant/pending-approval")
    public ApiResponse<List<OrderResponse>> getAllOrderTenantStatusPendingApproval(JwtAuthenticationToken jwtToken){
        List<OrderResponse> orderResponse = orderService.getAllOrderTenantStatusPendingApproval( jwtToken);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderResponse)
                .message("Get all Order StatusPendingApproval thành cong cua nhà hàng")
                .build();
    }

    // [2] - Get all đơn hàng đang chờ xử lý của staff đó quản trị
    @GetMapping("/pending-approval")
    public ApiResponse<List<OrderResponse>> getAllOrderTenantStatusPendingApprovalByStaff(JwtAuthenticationToken jwtToken){
        List<OrderResponse> orderResponse = orderService.getAllOrderTenantStatusPendingApprovalByStaff( jwtToken);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderResponse)
                .message("Get All thành công Order StatusPendingApproval cua staff nó quản trị")
                .build();
    }


    // [3] - Get all đơn hàng của staff đó quản trị
    @GetMapping("")
    public ApiResponse<List<OrderResponse>> getAllOrderTenantByStaff(JwtAuthenticationToken jwtToken){
        List<OrderResponse> orderResponse = orderService.getAllTenantOrderByStaff( jwtToken);
        return ApiResponse.<List<OrderResponse>>builder()
                .result(orderResponse)
                .message("Get All thành cong Order cua staff nó quản trị")
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
    @GetMapping("/{orderId}/invoice/pdf")
    public ResponseEntity<byte[]> exportInvoicePdf(
            @PathVariable Integer orderId,
            JwtAuthenticationToken jwtAuthenticationToken
    ) {
        byte[] pdfBytes = orderService.generateInvoicePdf(orderId, jwtAuthenticationToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + orderId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }


}
