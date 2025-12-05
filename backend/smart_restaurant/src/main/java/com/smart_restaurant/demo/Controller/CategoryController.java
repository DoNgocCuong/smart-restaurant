package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.CategoryService;
import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.Category;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;
    AccountService accountService;

    @PostMapping("")
    public ApiResponse<Category> createCategory(
            @RequestBody CategoryRequest request,
            JwtAuthenticationToken jwtToken) {

        String username = jwtToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Category category = categoryService.createCategory(request, tenantId);

        return ApiResponse.<Category>builder()
                        .message("Category created successfully")
                        .result(category)
                        .build();
    }


}
