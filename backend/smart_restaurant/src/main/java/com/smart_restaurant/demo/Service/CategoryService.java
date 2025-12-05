package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.entity.Category;

public interface CategoryService {
    public Category createCategory(CategoryRequest request, Integer tenant_id);
}
