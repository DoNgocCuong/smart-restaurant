package com.smart_restaurant.demo.mapper;


import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Item;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface ItemMapper {
    Item toItem(ItemRequest item);
    ItemResponse toItemResponse (Item item);
}
