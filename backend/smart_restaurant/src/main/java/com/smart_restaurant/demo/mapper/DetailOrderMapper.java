package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.Repository.DetailOrderRepository;
import com.smart_restaurant.demo.dto.Request.DetailOrderRequest;
import com.smart_restaurant.demo.dto.Request.UpdateDetailOrderRequest;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import com.smart_restaurant.demo.entity.DetailOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring",  uses = {ModifierOptionMapper.class})
public interface DetailOrderMapper {

    @Mapping(source = "item.itemId", target = "itemId")
    @Mapping(source = "item.itemName", target = "itemName")
    @Mapping(source = "modifies", target = "modifiers")
    DetailOrderResponse toDetailOrderResponse (DetailOrder detailOrder);
    DetailOrder toDetailOrder (DetailOrderRequest detailOrderRequest);


    void updateDetailOrder(@MappingTarget DetailOrder detailOrder, UpdateDetailOrderRequest updateDetailOrderRequest);
}
