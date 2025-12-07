package com.smart_restaurant.demo.Service.Impl;

import ch.qos.logback.classic.spi.IThrowableProxy;
import com.smart_restaurant.demo.Repository.CategoryRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.CategoryService;
import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.CategoryMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {

    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    TenantRepository tenantRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request, Integer tenant_id) {

        Tenant tenant = tenantRepository.findById(tenant_id)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));


        boolean exists = categoryRepository.existsByCategoryNameAndTenantTenantId(request.getCategoryName(), tenant_id);
        if (exists) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS_FOR_TENANT);
        }

        Category category = categoryMapper.toCategory(request);
        category.setTenant(tenant);
        Category savedCategory = categoryRepository.save(category);


        CategoryResponse response = categoryMapper.toCategoryResponse(savedCategory);
        response.setCategoryName(savedCategory.getCategoryName());
        response.setTenantId(savedCategory.getTenant().getTenantId());

        return response;

    }

    @Override
    public List<CategoryResponse> getAllCategories(Integer tenant_id) {

        // Kiểm tra tenant tồn tại
        tenantRepository.findById(tenant_id)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        // Lấy danh sách category theo tenant-id
        var categories = categoryRepository.findAllByTenant_TenantId(tenant_id);

        // Map thủ công sang DTO
        return categories.stream()
                .map(cat -> {
                    CategoryResponse dto = new CategoryResponse();
                    dto.setCategoryName(cat.getCategoryName());
                    dto.setTenantId(cat.getTenant().getTenantId());
                    return dto;
                })
                .toList();
    }


}
