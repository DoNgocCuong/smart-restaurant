package com.smart_restaurant.demo.Service.Impl;


import com.smart_restaurant.demo.Repository.CategoryRepository;
import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.Repository.ModifierGroupRepository;
import com.smart_restaurant.demo.Service.CategoryService;
import com.smart_restaurant.demo.Service.ItemService;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.ModifierGroup;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ItemMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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

    @Override
    public ItemResponse createItem(ItemRequest request) {
        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
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
    public ItemResponse updateItemById(Integer id, UpdateItemRequest updateItemRequest) {

        // 1. Lấy item cần update
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        // 2. Validate category
        List<Category> categories = categoryRepository.findAllById(updateItemRequest.getCategoryIds());
        if (categories.size() != updateItemRequest.getCategoryIds().size()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // 3. Kiểm tra trùng tên item trong các category (bỏ qua chính item này)
        boolean existsItem = itemRepository.existsByItemNameAndCategoryInAndItemIdNot(
                updateItemRequest.getItemName(),
                categories,
                id
        );
        if (existsItem) {
            throw new AppException(ErrorCode.ITEM_ALREADY_EXISTS);
        }

        // 4. Validate modifierGroups nếu có
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

        // 5. Map các trường đơn từ DTO sang entity
        itemMapper.updateItem(item, updateItemRequest);

        // 6. Update category
        item.setCategory(categories);

        // 7. Lưu DB
        Item updatedItem = itemRepository.save(item);

        // 8. Build response
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

}
