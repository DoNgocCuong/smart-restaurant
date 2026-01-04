package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.InvoiceResponse;
import com.smart_restaurant.demo.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    InvoiceResponse toInvoiceResponse(Order order);
}
