package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTableRequest;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import com.smart_restaurant.demo.entity.RestaurantTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TableMapper {

    RestaurantTable toTable(TableRequest tableRequest);
    TableResponse toTableResponse(RestaurantTable restaurantTable);

    @Mapping(target = "tenant", ignore = true)
    @Mapping(target = "orders", ignore = true)
    void updateTable(@MappingTarget RestaurantTable restaurantTable, UpdateTableRequest updateTableRequest);
}
