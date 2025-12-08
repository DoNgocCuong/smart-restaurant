package com.smart_restaurant.demo.mapper;


import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")

public interface ItemMapper {
    Item toItem(ItemRequest item);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "modifierGroup", ignore = true)
    ItemResponse toItemResponse (Item item);
    void updateItem(@MappingTarget Item item, UpdateItemRequest updateItemRequest);
}
