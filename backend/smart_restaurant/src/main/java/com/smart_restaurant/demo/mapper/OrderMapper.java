package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderResponse toOrderResponse(Order order);

    @Mapping(target = "customerName", ignore = true)
    @Mapping(target = "isHaveName", ignore = true)
    Order toOrder (OrderRequest orderRequest);
}
