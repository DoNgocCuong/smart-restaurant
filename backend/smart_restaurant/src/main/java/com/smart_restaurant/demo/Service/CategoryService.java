package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.entity.Category;

import java.util.List;

public interface CategoryService {
    public CategoryResponse createCategory(CategoryRequest request, Integer tenant_id);
    public List<CategoryResponse> getAllCategories(Integer tenant_id);
}
