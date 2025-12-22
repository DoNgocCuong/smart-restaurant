package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.CategoryService;
import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.Category;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;
    AccountService accountService;

@PostMapping("")
public ApiResponse<CategoryResponse> createCategory(
        @Valid @RequestBody CategoryRequest request,
        JwtAuthenticationToken jwtAuthenticationToken) {

    CategoryResponse category = categoryService.createCategory(request, jwtAuthenticationToken);

    return ApiResponse.<CategoryResponse>builder()
            .message("Category created successfully")
            .result(category)
            .build();
}

    @GetMapping("")
    public ApiResponse<List<CategoryResponse>> getAllCategories(
            JwtAuthenticationToken jwtAuthenticationToken) {

        List<CategoryResponse> categories = categoryService.getAllCategories(jwtAuthenticationToken);

        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Categories retrieved successfully")
                .result(categories)
                .build();
    }

    @GetMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> getCategoryById(
            @PathVariable Integer categoryId,
            JwtAuthenticationToken jwtAuthenticationToken) {

        CategoryResponse category = categoryService.getCategoryById(categoryId, jwtAuthenticationToken);

        return ApiResponse.<CategoryResponse>builder()
                .message("Category retrieved successfully")
                .result(category)
                .build();
    }

    @PutMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Integer categoryId,
            @Valid @RequestBody CategoryRequest request,
            JwtAuthenticationToken jwtAuthenticationToken) {

        CategoryResponse category = categoryService.updateCategory(categoryId, request, jwtAuthenticationToken);

        return ApiResponse.<CategoryResponse>builder()
                .message("Category updated successfully")
                .result(category)
                .build();
    }

    @DeleteMapping("/{categoryId}")
    public ApiResponse<String> deleteCategory(
            @PathVariable Integer categoryId,
            JwtAuthenticationToken jwtAuthenticationToken) {

        categoryService.deleteCategory(categoryId, jwtAuthenticationToken);

        return ApiResponse.<String>builder()
                .message("Category deleted successfully")
                .result("Category đã được xóa")
                .build();
    }


}
