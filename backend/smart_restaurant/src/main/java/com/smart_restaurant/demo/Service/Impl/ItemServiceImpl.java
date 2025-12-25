package com.smart_restaurant.demo.Service.Impl;


import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.ItemService;
import com.smart_restaurant.demo.Service.ItemSpecification;
import com.smart_restaurant.demo.dto.Request.AvatarRequest;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.MenuAvailabilityToggleListRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.CategoryResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.entity.*;
import com.smart_restaurant.demo.enums.ItemSortType;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ImageMapper;
import com.smart_restaurant.demo.mapper.ItemMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
    ImageRepository imageRepository;
    ImageMapper imageMapper;
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
        item.setQuantitySold(0);

        Image avatar = Image.builder()
                .url(request.getAvatarUrl())
                .build();
        Image savedAvatar = imageRepository.save(avatar);
        item.setAvatar(savedAvatar);

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
        savedAvatar.setItem(savedItem);
        imageRepository.save(savedAvatar);

        ItemResponse itemResponse= itemMapper.toItemResponse(savedItem);

        // Map Avatar
        if (item.getAvatar() != null) {
            itemResponse.setAvatarUrl(savedItem.getAvatar().getUrl());  // ← Lấy URL từ Image entity
        }
        // Map category
        List<CategoryResponse> categoryDTOs = categories.stream()
                .map(c -> {
                    CategoryResponse cr = new CategoryResponse();
                    cr.setCategoryId(c.getCategoryId());
                    cr.setCategoryName(c.getCategoryName());
                    cr.setTenantId(c.getTenant().getTenantId());
                    return cr;
                }).toList();
        itemResponse.setCategory(categoryDTOs);

        // Map MODIFIERGOUP
        List<ModifierGroupResponse> modifierGroupDTOs = modifierGroup.stream()
                .map(mg -> {
                    ModifierGroupResponse mr = new ModifierGroupResponse();
                    mr.setModifierGroupId(mg.getModifierGroupId());
                    mr.setName(mg.getName());
                    mr.setIsRequired(mr.getIsRequired());
                    mr.setSelectionType(mr.getSelectionType());
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

        // Update avatar nếu có URL mới
        if (updateItemRequest.getAvatarUrl() != null && !updateItemRequest.getAvatarUrl().isBlank()) {
            if (item.getAvatar() != null) {
                // Update URL của avatar cũ
                item.getAvatar().setUrl(updateItemRequest.getAvatarUrl());
                imageRepository.save(item.getAvatar());
            } else {
                // Tạo avatar mới nếu chưa có
                Image newAvatar = Image.builder()
                        .url(updateItemRequest.getAvatarUrl())
                        .item(item)
                        .build();
                Image savedAvatar = imageRepository.save(newAvatar);
                item.setAvatar(savedAvatar);
            }
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

        if (item.getAvatar() != null) {
            itemResponse.setAvatarUrl(item.getAvatar().getUrl());
        }

        List<CategoryResponse> categoryDTOs = categories.stream()
                .map(c -> {
                    CategoryResponse cr = new CategoryResponse();
                    cr.setCategoryId(c.getCategoryId());
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
                    mr.setIsRequired(mr.getIsRequired());
                    mr.setSelectionType(mr.getSelectionType());
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
public Page<ItemResponse> getAllItems(int page, int size,
                                      JwtAuthenticationToken jwtAuthenticationToken) {
    String username = jwtAuthenticationToken.getName();
    Integer tenantId = accountService.getTenantIdByUsername(username);

    tenantRepository.findById(tenantId)
            .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

    // Tạo Pageable
    Pageable pageable = PageRequest.of(0, 10, Sort.by("itemId").descending());

    // Lấy items thuộc tenant này
    Page<Item> itemsPage = itemRepository.findAllByTenantId(tenantId, pageable);

    return itemsPage.map(item -> {
        ItemResponse itemResponse = itemMapper.toItemResponse(item);

        if (item.getAvatar() != null) {
            itemResponse.setAvatarUrl(item.getAvatar().getUrl());
        }

        List<CategoryResponse> categoryDTOs = item.getCategory().stream()
                .filter(c -> c.getTenant().getTenantId().equals(tenantId)) // Lọc category của tenant
                .map(c -> new CategoryResponse(
                        c.getCategoryId(),
                        c.getCategoryName(),
                        c.getTenant().getTenantId()
                ))
                .toList();
        itemResponse.setCategory(categoryDTOs);

        List<ModifierGroupResponse> modifierGroupDTOs = item.getModifierGroups().stream()
                .map(mg -> new ModifierGroupResponse(
                        mg.getModifierGroupId(),
                        mg.getName(),
                        mg.getSelectionType(),
                        mg.getIsRequired(),
                        mg.getItems(),
                        mg.getOptions(),
                        mg.getTenant().getTenantId()
                ))
                .toList();
        itemResponse.setModifierGroup(modifierGroupDTOs);

        return itemResponse;
    });
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

            if (item.getStatus() != itemRequest.isStatus()) {
                item.setStatus(itemRequest.isStatus());
                itemRepository.save(item);
            }
            Item updatedItem = itemRepository.save(item);

            ItemResponse itemResponse = itemMapper.toItemResponse(updatedItem);

            if (item.getAvatar() != null) {
                itemResponse.setAvatarUrl(item.getAvatar().getUrl());  // ← Lấy URL từ Image entity
            }

            List<CategoryResponse> categoryDTOs = updatedItem.getCategory().stream()
                    .map(category -> {
                        CategoryResponse categoryResponse = new CategoryResponse();
                        categoryResponse.setCategoryName(category.getCategoryName());
                        categoryResponse.setTenantId(category.getTenant().getTenantId());
                        categoryResponse.setCategoryId(category.getTenant().getTenantId());
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

    private Sort getSortBy(String sortBy) {
        if (sortBy == null) {
            sortBy = "POPULAR";
        }
        return switch (sortBy.toUpperCase()) {
//            case "POPULAR" -> Sort.by(Sort.Direction.DESC, "itemId");
            case "PRICE_ASC" -> Sort.by(Sort.Direction.ASC, "price");
            case "PRICE_DESC" -> Sort.by(Sort.Direction.DESC, "price");
            case "NAME" -> Sort.by(Sort.Direction.ASC, "itemName");
            case "NEWEST" -> Sort.by(Sort.Direction.DESC, "itemId");
            default -> Sort.by(Sort.Direction.DESC, "itemId");
        };
    }

    @Override
    public String replaceAvatar(AvatarRequest avatarRequest, Integer itemId) {
        Item item=itemRepository.findById(itemId).orElseThrow(()->new AppException(ErrorCode.ITEM_NOT_FOUND));
        Image image=imageMapper.toImage(avatarRequest);
        item.setAvatar(imageRepository.save(image));
        itemRepository.save(item);
        return "replace avatar successfully";
    }

    @Override
    public Page<ItemResponse> getAllItemsByChefRecommendation(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Kiểm tra tenant tồn tại
        tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        // Tạo Pageable
        Pageable pageable = PageRequest.of(0, 10, Sort.by("itemId").descending());

        // Lấy items thuộc tenant này và có isKitchen = true
        Page<Item> itemsPage = itemRepository.findByTenantIdAndIsKitchenTrue(tenantId, pageable);

        // Chuyển đổi sang DTO và lọc items theo tenant
        return itemsPage.map(item -> {
            ItemResponse itemResponse = itemMapper.toItemResponse(item);

            if (item.getAvatar() != null) {
                itemResponse.setAvatarUrl(item.getAvatar().getUrl());
            }

            List<CategoryResponse> categoryDTOs = item.getCategory().stream()
                    .filter(c -> c.getTenant().getTenantId().equals(tenantId)) // Lọc category của tenant
                    .map(c -> new CategoryResponse(
                            c.getCategoryId(),
                            c.getCategoryName(),
                            c.getTenant().getTenantId()
                    ))
                    .toList();
            itemResponse.setCategory(categoryDTOs);

            List<ModifierGroupResponse> modifierGroupDTOs = item.getModifierGroups().stream()
                    .map(mg -> new ModifierGroupResponse(
                            mg.getModifierGroupId(),
                            mg.getName(),
                            mg.getSelectionType(),
                            mg.getIsRequired(),
                            mg.getItems(),
                            mg.getOptions(),
                            mg.getTenant().getTenantId()
                    ))
                    .toList();
            itemResponse.setModifierGroup(modifierGroupDTOs);

            return itemResponse;
        });
    }
    public Page<ItemResponse> getAllFilter(
            int page,
            int size,
            String name,
            Integer categoryId,
            Boolean status,
            ItemSortType sortBy,
            Sort.Direction direction,
            JwtAuthenticationToken jwtAuthenticationToken
    ) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));
        Specification<Item> spec =
                ItemSpecification.filter(name, categoryId, status,tenantId);

        Sort sort = buildSort(sortBy, direction);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Item> pageResult = itemRepository.findAll(spec, pageable);
        return pageResult.map(item -> {
            ItemResponse itemResponse = itemMapper.toItemResponse(item);

            if (item.getAvatar() != null) {
                itemResponse.setAvatarUrl(item.getAvatar().getUrl());
            }

            List<CategoryResponse> categoryDTOs = item.getCategory().stream()
                    .filter(c -> c.getTenant().getTenantId().equals(tenantId)) // Lọc category của tenant
                    .map(c -> new CategoryResponse(
                            c.getCategoryId(),
                            c.getCategoryName(),
                            c.getTenant().getTenantId()
                    ))
                    .toList();
            itemResponse.setCategory(categoryDTOs);

            List<ModifierGroupResponse> modifierGroupDTOs = item.getModifierGroups().stream()
                    .map(mg -> new ModifierGroupResponse(
                            mg.getModifierGroupId(),
                            mg.getName(),
                            mg.getSelectionType(),
                            mg.getIsRequired(),
                            mg.getItems(),
                            mg.getOptions(),
                            mg.getTenant().getTenantId()
                    ))
                    .toList();
            itemResponse.setModifierGroup(modifierGroupDTOs);

            return itemResponse;
        });
    }

    private Sort buildSort(ItemSortType sortBy, Sort.Direction direction) {
        return switch (sortBy) {
            case POPULAR -> Sort.by(direction, "quantitySold");   // hoặc viewCount
            case PRICE -> Sort.by(direction, "price");
            case CREATED_DATE -> Sort.by(direction, "createAt");
        };
    }

    private ItemResponse buildItemResponse(Item item) {
        ItemResponse itemResponse = itemMapper.toItemResponse(item);

        if (item.getAvatar() != null) {
            itemResponse.setAvatarUrl(item.getAvatar().getUrl());
        }

        // Luôn set list, không bao giờ null
        if (item.getCategory() != null && !item.getCategory().isEmpty()) {
            List<CategoryResponse> categoryDTOs = item.getCategory().stream()
                    .map(c -> new CategoryResponse(
                            c.getCategoryId(),
                            c.getCategoryName(),
                            c.getTenant().getTenantId()
                    ))
                    .toList();
            itemResponse.setCategory(categoryDTOs);
        } else {
            itemResponse.setCategory(new ArrayList<>()); // ← Set empty list, không null
        }

        if (item.getModifierGroups() != null && !item.getModifierGroups().isEmpty()) {
            List<ModifierGroupResponse> modifierGroupDTOs = item.getModifierGroups().stream()
                    .map(mg -> new ModifierGroupResponse(
                            mg.getModifierGroupId(),
                            mg.getName(),
                            mg.getSelectionType(),
                            mg.getIsRequired(),
                            mg.getItems(),
                            mg.getOptions(),
                            mg.getTenant().getTenantId()
                    ))
                    .toList();
            itemResponse.setModifierGroup(modifierGroupDTOs);
        } else {
            itemResponse.setModifierGroup(new ArrayList<>()); // ← Set empty list, không null
        }

        return itemResponse;
    }
}
