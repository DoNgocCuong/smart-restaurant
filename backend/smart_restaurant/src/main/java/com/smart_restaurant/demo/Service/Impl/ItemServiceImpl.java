package com.smart_restaurant.demo.Service.Impl;


import com.smart_restaurant.demo.Repository.CategoryRepository;
import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.Repository.ModifierGroupRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.CategoryService;
import com.smart_restaurant.demo.Service.ItemService;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.MenuAvailabilityToggleListRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.ModifierGroup;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ItemMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ItemServiceImpl implements ItemService {

    CategoryRepository categoryRepository;
    ItemMapper itemMapper;
    ItemRepository itemRepository;
    ModifierGroupRepository modifierGroupRepository;
    AccountService accountService;
    TenantRepository tenantRepository;

    @Override
    public ItemResponse createItem(ItemRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        // Lấy tenant_id từ username trong JWT
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Lấy categories từ request
        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Kiểm tra tenant: tất cả categories phải thuộc tenant của user
        boolean invalidTenant = categories.stream()
                .anyMatch(c -> !c.getTenant().getTenantId().equals(tenantId));
        if (invalidTenant) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }


       // Kiem tra trung Item
        boolean existsItem = itemRepository.existsByItemNameAndCategoryIn(request.getItemName(), categories);
        if (existsItem) {
            throw new AppException(ErrorCode.ITEM_ALREADY_EXISTS);
        }

        Item item = itemMapper.toItem(request);
        item.setCategory(categories);

        // Phần modifierGroup
        List<ModifierGroup> modifierGroup = new ArrayList<>();

        if ( request.getModifierGroupIds() != null){
            modifierGroup = modifierGroupRepository.findAllById(request.getModifierGroupIds());
            if (modifierGroup.size() != request.getModifierGroupIds().size()) {
                throw new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND);
            }
            item.setModifierGroups(modifierGroup);
        }
        Item savedItem = itemRepository.save(item);

        ItemResponse itemResponse= itemMapper.toItemResponse(savedItem);
        List<CategoryResponse> categoryDTOs = categories.stream()
                .map(c -> {
                    CategoryResponse cr = new CategoryResponse();
                    cr.setCategoryName(c.getCategoryName());
                    cr.setTenantId(c.getTenant().getTenantId());
                    return cr;
                }).toList();
        itemResponse.setCategory(categoryDTOs);

        List<ModifierGroupResponse> modifierGroupDTOs = modifierGroup.stream()
                .map(mg -> {
                    ModifierGroupResponse mr = new ModifierGroupResponse();
                    mr.setModifierGroupId(mg.getModifierGroupId());
                    mr.setName(mg.getName());
                    return mr;
                }).toList();
        itemResponse.setModifierGroup(modifierGroupDTOs);
        return itemResponse;
    }


    @Override
    public ItemResponse updateItemById(Integer id, UpdateItemRequest updateItemRequest, JwtAuthenticationToken jwtAuthenticationToken) {

        // Lay tenant_id boi username
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        //  Lấy item cần update
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        // [ Kiểm tra tenant (multi-tenant check) ] **
        boolean invalidTenant = item.getCategory()
                .stream()
                .anyMatch(category -> !category.getTenant().getTenantId().equals(tenantId));
        if (invalidTenant) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Validate category
        List<Category> categories = categoryRepository.findAllById(updateItemRequest.getCategoryIds());
        if (categories.size() != updateItemRequest.getCategoryIds().size()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Kiểm tra trùng tên item trong các category (bỏ qua chính item này)
        boolean existsItem = itemRepository.existsByItemNameAndCategoryInAndItemIdNot(
                updateItemRequest.getItemName(),
                categories,
                id
        );
        if (existsItem) {
            throw new AppException(ErrorCode.ITEM_ALREADY_EXISTS);
        }

        // Validate modifierGroups nếu có
        List<ModifierGroup> modifierGroup;
        if (updateItemRequest.getModifierGroupIds() != null) {
            modifierGroup = modifierGroupRepository.findAllById(updateItemRequest.getModifierGroupIds());
            if (modifierGroup.size() != updateItemRequest.getModifierGroupIds().size()) {
                throw new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND);
            }
            item.setModifierGroups(modifierGroup);
        } else {
            modifierGroup = item.getModifierGroups();
        }

        // Map các trường đơn từ DTO sang entity
        itemMapper.updateItem(item, updateItemRequest);

        // Update category
        item.setCategory(categories);

        // Lưu DB
        Item updatedItem = itemRepository.save(item);

        // Build response
        ItemResponse itemResponse = itemMapper.toItemResponse(updatedItem);

        List<CategoryResponse> categoryDTOs = categories.stream()
                .map(c -> {
                    CategoryResponse cr = new CategoryResponse();
                    cr.setCategoryName(c.getCategoryName());
                    cr.setTenantId(c.getTenant().getTenantId());
                    return cr;
                }).toList();
        itemResponse.setCategory(categoryDTOs);

        // Map ModifierGroup thủ công
        List<ModifierGroupResponse> modifierGroupDTOs = modifierGroup.stream()
                .map(mg -> {
                    ModifierGroupResponse mr = new ModifierGroupResponse();
                    mr.setModifierGroupId(mg.getModifierGroupId());
                    mr.setName(mg.getName());
                    return mr;
                }).toList();
        itemResponse.setModifierGroup(modifierGroupDTOs);
        return itemResponse;

    }

    @Override
    public void deleteItemById(Integer itemId, JwtAuthenticationToken jwtAuthenticationToken) {

        // Lay tenant_id boi username
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);


        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        boolean invalidTenant = item.getCategory()
                .stream()
                .anyMatch(category -> !category.getTenant().getTenantId().equals(tenantId));

        if (invalidTenant) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        itemRepository.delete(item);
    }

    @Override
    public List<ItemResponse> getAllItemByTenant(JwtAuthenticationToken jwtAuthenticationToken) {
        // Lay tenant_id boi username
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        List<Item> tenantItems = itemRepository.findAllByTenantId(tenantId);

        // Map sang ItemResponse
        return tenantItems.stream().map(item -> {
            ItemResponse itemResponse = itemMapper.toItemResponse(item);


            List<CategoryResponse> categoryDTOs = item.getCategory().stream()
                    .map(c -> new CategoryResponse(c.getCategoryName(), c.getTenant().getTenantId()))
                    .toList();
            itemResponse.setCategory(categoryDTOs);

            List<ModifierGroupResponse> modifierGroupDTOs = item.getModifierGroups().stream()
                    .map(mg -> new ModifierGroupResponse(mg.getModifierGroupId(), mg.getName(),mg.getItems(), mg.getOptions(), mg.getTenant().getTenantId()))
                    .toList();
            itemResponse.setModifierGroup(modifierGroupDTOs);

            return itemResponse;
        }).toList();


    }

    @Override
    public List<ItemResponse> updateMenuAvailabilityToggle(MenuAvailabilityToggleListRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        // Lay tenant_id boi username
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        List<ItemResponse> updatedItems = request.getItems().stream().map(itemRequest ->{

            // Lấy Item
            Item item = itemRepository.findById(itemRequest.getItemId()).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

            // Kiểm tra có phải chính thằng teant cầm thằng item này không
            boolean invalidTenant = item.getCategory().stream()
                    .anyMatch(category -> !category.getTenant().getTenantId().equals(tenantId));
            if (invalidTenant) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            if (item.isStatus() != itemRequest.isStatus()) {
                item.setStatus(itemRequest.isStatus());
                itemRepository.save(item);
            }
            Item updatedItem = itemRepository.save(item);

            ItemResponse itemResponse = itemMapper.toItemResponse(updatedItem);
            List<CategoryResponse> categoryDTOs = updatedItem.getCategory().stream()
                    .map(category -> {
                        CategoryResponse categoryResponse = new CategoryResponse();
                        categoryResponse.setCategoryName(category.getCategoryName());
                        categoryResponse.setTenantId(category.getTenant().getTenantId());
                        return categoryResponse;
                    }).toList();
            itemResponse.setCategory(categoryDTOs);

            List<ModifierGroupResponse> modifierGroupDTOs = updatedItem.getModifierGroups().stream()
                    .map(modifierGroup -> {
                        ModifierGroupResponse modifierGroupResponse = new ModifierGroupResponse();
                        modifierGroupResponse.setModifierGroupId(modifierGroup.getModifierGroupId());
                        modifierGroupResponse.setName(modifierGroup.getName());
                        return modifierGroupResponse;
                    }).toList();
            itemResponse.setModifierGroup(modifierGroupDTOs);


            return itemResponse;

        }).toList();

        return updatedItems;
    }

}
