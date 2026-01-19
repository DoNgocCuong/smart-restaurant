package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.InvoiceResponse;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Request.UpdateOrderStatusRequest;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.Order;
import org.mapstruct.*;

@Mapper(componentModel = "spring",  uses = {ModifierOptionMapper.class, ModifierGroupMapper.class, DetailOrderMapper.class, TableMapper.class, CustomerMapper.class})
public interface OrderMapper {

    InvoiceResponse toInvoiceResponse(Order order);

    @Mapping(target = "customerName", source = "customerName")
    @Mapping(target = "customerId", source = "customer.customerId")
    @Mapping(target = "tableId", source = "table.tableId")
    @Mapping(target = "oderStatus", source = "status.orderStatus")
    OrderResponse toOrderResponse(Order order);

    @Mapping(target = "customerName", ignore = true)
    @Mapping(target = "isHaveName", ignore = true)
    Order toOrder (OrderRequest orderRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateOrder(@MappingTarget Order order, UpdateOrderStatusRequest updateOrderStatusRequest);

}
