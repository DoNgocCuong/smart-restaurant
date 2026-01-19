package com.smart_restaurant.demo.Controller;


import com.smart_restaurant.demo.Service.DetailOrderService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detail-orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DetailOrderController {
    DetailOrderService detailOrderService;

    @PutMapping("/orders/{orderId}")
    public ApiResponse<List<DetailOrderResponse>> approveAllDetailOrders(
            @PathVariable Integer orderId) {

        List<DetailOrderResponse> detailOrderResponse = detailOrderService.approveAllDetailOrders(orderId);

        return ApiResponse.<List<DetailOrderResponse>>builder()
                .message("Chấp nhận tất cả detail order thành công")
                .result(detailOrderResponse)
                .build();
    }


}
