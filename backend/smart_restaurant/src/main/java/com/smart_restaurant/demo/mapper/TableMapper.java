package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import com.smart_restaurant.demo.entity.RestaurantTable;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TableMapper {
    @Mapping(target = "active",expression = "java(true)")
    RestaurantTable toTable(TableRequest tableRequest);
    @Mapping(source = "active", target = "isActive")
    TableResponse toTableResponse(RestaurantTable restaurantTable);
    List<TableResponse> toTableResponseList(List<RestaurantTable> entities);
}
