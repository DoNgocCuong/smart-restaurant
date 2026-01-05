package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.InvoiceResponse;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    InvoiceResponse toInvoiceResponse(Order order);

    OrderResponse toOrderResponse(Order order);
    Order toOrder (OrderRequest orderRequest);
}
