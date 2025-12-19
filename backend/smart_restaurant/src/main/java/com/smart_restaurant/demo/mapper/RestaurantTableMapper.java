package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.RestaurantTableResponse;
import com.smart_restaurant.demo.entity.RestaurantTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RestaurantTableMapper {
    RestaurantTableResponse toRestaurantTableResponse(RestaurantTable restaurantTable);
}
