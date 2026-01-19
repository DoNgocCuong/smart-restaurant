package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest category);

    @Mapping(source = "isActive", target = "isActive")
    CategoryResponse toCategoryResponse(Category category);
}
