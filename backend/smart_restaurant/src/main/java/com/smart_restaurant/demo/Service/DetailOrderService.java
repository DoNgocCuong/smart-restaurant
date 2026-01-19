package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;

public interface DetailOrderService {

    DetailOrderResponse approveDetailOrder(Integer detailOrderId);
}
