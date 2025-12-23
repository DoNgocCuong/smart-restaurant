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
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "modifierGroups", ignore = true)
    Item toItem(ItemRequest item);

    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "modifierGroup", ignore = true)
    @Mapping(source = "isKitchen", target = "isKitchen")
    ItemResponse toItemResponse (Item item);

    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "modifierGroups", ignore = true)
    void updateItem(@MappingTarget Item item, UpdateItemRequest updateItemRequest);
}
