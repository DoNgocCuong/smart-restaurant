package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;

import java.util.List;

public interface DetailOrderService {

    List<DetailOrderResponse> approveAllDetailOrders(Integer orderId);
}
