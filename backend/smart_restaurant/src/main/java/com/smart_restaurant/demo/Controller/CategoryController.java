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
            JwtAuthenticationToken jwtToken) {

        String username = jwtToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        CategoryResponse category = categoryService.createCategory(request, tenantId);

        return ApiResponse.<CategoryResponse>builder()
                        .message("Category created successfully")
                        .result(category)
                        .build();
    }

    @GetMapping("")
    public ApiResponse<List<CategoryResponse>> getAllCategories(JwtAuthenticationToken jwtToken){
        String username = jwtToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        List<CategoryResponse> categories = categoryService.getAllCategories(tenantId);

        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Categories retrieved successfully")
                .result(categories)
                .build();

    }


}
