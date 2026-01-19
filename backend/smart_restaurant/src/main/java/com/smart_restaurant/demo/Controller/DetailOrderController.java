package com.smart_restaurant.demo.Controller;


import com.smart_restaurant.demo.Service.DetailOrderService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/detail-orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DetailOrderController {
    DetailOrderService detailOrderService;

    @PatchMapping("/status/{detailOrderId}")
    public ApiResponse<DetailOrderResponse> approveDetailOrder(@PathVariable Integer detailOrderId){

        DetailOrderResponse detailOrderResponse = detailOrderService.approveDetailOrder(detailOrderId);
        return ApiResponse.<DetailOrderResponse>builder()
                .message("Chấp nhận detailorder moi thành công")
                .result(detailOrderResponse)
                .build();
    }


}
