
package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTableRequest;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import com.smart_restaurant.demo.dto.Response.TableResponseActive;
import com.smart_restaurant.demo.entity.RestaurantTable;

import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TableMapper {
    @Mapping(target = "is_active",expression = "java(true)")
    RestaurantTable toTable(TableRequest tableRequest);
    TableResponse toTableResponse(RestaurantTable restaurantTable);
    List<TableResponse> toTableResponseList(List<RestaurantTable> entities);

    @Mapping(target = "tenant", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateTable(@MappingTarget RestaurantTable restaurantTable, UpdateTableRequest updateTableRequest);


    TableResponseActive toTableResponseActive(RestaurantTable restaurantTable);
}
    
