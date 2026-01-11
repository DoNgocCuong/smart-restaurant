package com.smart_restaurant.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import com.smart_restaurant.demo.dto.Request.MomoPaymentRequest;
import com.smart_restaurant.demo.dto.Response.MomoPaymentResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momo", url = "${momo.end-point}")
public interface MomoApi {

    @PostMapping("/create")
    MomoPaymentResponse createMomoQR(@RequestBody MomoPaymentRequest createMomoRequest);
}
