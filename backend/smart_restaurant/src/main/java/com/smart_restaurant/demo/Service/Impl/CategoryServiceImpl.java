package com.smart_restaurant.demo.Service.Impl;

import ch.qos.logback.classic.spi.IThrowableProxy;
import com.smart_restaurant.demo.Repository.CategoryRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.CategoryService;
import com.smart_restaurant.demo.dto.Request.CategoryRequest;
import com.smart_restaurant.demo.dto.Request.UpdateCategoryIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemStatusRequest;
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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    AccountService accountService;


    @Override
    public CategoryResponse createCategory(CategoryRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        // Kiểm tra category đã tồn tại với tên này cho tenant không
        boolean exists = categoryRepository.existsByCategoryNameAndTenantTenantId(request.getCategoryName(), tenantId);
        if (exists) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS_FOR_TENANT);
        }

        Category category = categoryMapper.toCategory(request);
        category.setTenant(tenant);
        Category savedCategory = categoryRepository.save(category);

        CategoryResponse response = categoryMapper.toCategoryResponse(savedCategory);
        response.setCategoryName(savedCategory.getCategoryName());
        response.setIsActive(savedCategory.getIsActive());
        response.setTenantId(savedCategory.getTenant().getTenantId());

        return response;
    }

    @Override
    public List<CategoryResponse> getAllCategories(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Kiểm tra tenant tồn tại
        tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        // Lấy danh sách category theo tenant
        var categories = categoryRepository.findAllByTenant_TenantId(tenantId);

        return categories.stream()
                .map(cat -> {
                    CategoryResponse dto = new CategoryResponse();
                    dto.setCategoryId(cat.getCategoryId());
                    dto.setCategoryName(cat.getCategoryName());
                    dto.setIsActive(cat.getIsActive());
                    dto.setTenantId(cat.getTenant().getTenantId());
                    return dto;
                })
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Integer categoryId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Kiểm tra category có thuộc tenant hiện tại không
        if (!category.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        CategoryResponse response = new CategoryResponse();
        response.setCategoryId(category.getCategoryId());
        response.setCategoryName(category.getCategoryName());
        response.setIsActive(category.getIsActive());
        response.setTenantId(category.getTenant().getTenantId());

        return response;
    }

    @Override
    public CategoryResponse updateCategory(Integer categoryId, CategoryRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Kiểm tra category có thuộc tenant hiện tại không
        if (!category.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Kiểm tra tên category mới có trùng với category khác không (trong cùng tenant)
        if (!category.getCategoryName().equals(request.getCategoryName())) {
            boolean exists = categoryRepository.existsByCategoryNameAndTenantTenantId(request.getCategoryName(), tenantId);
            if (exists) {
                throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS_FOR_TENANT);
            }
        }

        // Cập nhật thông tin
        category.setCategoryName(request.getCategoryName());
        Category updatedCategory = categoryRepository.save(category);

        CategoryResponse response = new CategoryResponse();
        response.setCategoryId(updatedCategory.getCategoryId());
        response.setCategoryName(updatedCategory.getCategoryName());
        response.setIsActive(updatedCategory.getIsActive());
        response.setTenantId(updatedCategory.getTenant().getTenantId());

        return response;
    }

    @Override
    public void deleteCategory(Integer categoryId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Kiểm tra category có thuộc tenant hiện tại không
        if (!category.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }


        categoryRepository.deleteById(categoryId);
    }

    @Override
    public CategoryResponse updateIsActiveCategory(Integer categoryId, UpdateCategoryIsActiveRequest updateCategoryIsActiveRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Kiểm tra category có thuộc tenant hiện tại không
        if (!category.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        category.setIsActive(updateCategoryIsActiveRequest.getIsActive());
        Category updatedCategory = categoryRepository.save(category);

        CategoryResponse response = new CategoryResponse();
        response.setCategoryId(updatedCategory.getCategoryId());
        response.setCategoryName(updatedCategory.getCategoryName());
        response.setIsActive(updatedCategory.getIsActive());
        response.setTenantId(updatedCategory.getTenant().getTenantId());

        return response;


    }



}
