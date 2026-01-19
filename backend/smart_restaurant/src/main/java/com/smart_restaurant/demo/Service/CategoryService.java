package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.dto.Request.UpdateCategoryIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemStatusRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.entity.Category;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface CategoryService {
//    public CategoryResponse createCategory(CategoryRequest request, Integer tenant_id);
//    public List<CategoryResponse> getAllCategories(Integer tenant_id);
    CategoryResponse createCategory(CategoryRequest request, JwtAuthenticationToken jwtAuthenticationToken);

    List<CategoryResponse> getAllCategories(JwtAuthenticationToken jwtAuthenticationToken);

    CategoryResponse getCategoryById(Integer categoryId, JwtAuthenticationToken jwtAuthenticationToken);

    CategoryResponse updateCategory(Integer categoryId, CategoryRequest request, JwtAuthenticationToken jwtAuthenticationToken);

    void deleteCategory(Integer categoryId, JwtAuthenticationToken jwtAuthenticationToken);

    CategoryResponse updateIsActiveCategory(Integer categoryId, UpdateCategoryIsActiveRequest updateCategoryIsActiveRequest, JwtAuthenticationToken jwtAuthenticationToken);
}
