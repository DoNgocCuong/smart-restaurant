package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.Repository.DetailOrderRepository;
import com.smart_restaurant.demo.dto.Request.DetailOrderRequest;
import com.smart_restaurant.demo.dto.Request.UpdateDetailOrderRequest;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import com.smart_restaurant.demo.entity.DetailOrder;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DetailOrderMapper {

    DetailOrderResponse toDetailOrderResponse (DetailOrder detailOrder);
    DetailOrder toDetailOrder (DetailOrderRequest detailOrderRequest);

    void updateDetailOrder(@MappingTarget DetailOrder detailOrder, UpdateDetailOrderRequest updateDetailOrderRequest);
}
