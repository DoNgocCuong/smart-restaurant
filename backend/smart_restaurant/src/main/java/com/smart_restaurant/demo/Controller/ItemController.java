package com.smart_restaurant.demo.Controller;


import com.smart_restaurant.demo.Service.ItemService;
import com.smart_restaurant.demo.dto.Request.AvatarRequest;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.MenuAvailabilityToggleListRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.enums.ItemSortType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.PublicKey;
import java.util.List;

@RestController
@RequestMapping("/api/menu/items")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ItemController {

    ItemService itemService;

    @PostMapping("")
    public ApiResponse<ItemResponse> createItem(@Valid @RequestBody ItemRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        ItemResponse item = itemService.createItem(request, jwtAuthenticationToken);
        return ApiResponse.<ItemResponse>builder()
                .message("Item created successfully")
                .result(item)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ItemResponse> updateItemById(@PathVariable Integer id, @Valid @RequestBody UpdateItemRequest updateItemRequest, JwtAuthenticationToken jwtAuthenticationToken){
        ItemResponse item = itemService.updateItemById(id,updateItemRequest, jwtAuthenticationToken);
        return ApiResponse.<ItemResponse>builder()
                .message("Item update successfully")
                .result(item)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteItemById(@PathVariable Integer id, JwtAuthenticationToken jwtAuthenticationToken) {
        itemService.deleteItemById(id, jwtAuthenticationToken);
        return ApiResponse.<Void>builder()
                .message("Item deleted successfully")
                .build();
    }

    @GetMapping("")
    public ApiResponse<Page<ItemResponse>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,

            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Boolean status,

            @RequestParam(defaultValue = "CREATED_DATE") ItemSortType sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction
    ) {

        Page<ItemResponse> result = itemService.getAllFilter(
                page, size, name, categoryId, status, sortBy, direction
        );

        return ApiResponse.<Page<ItemResponse>>builder()
                .message("Items retrieved successfully")
                .result(result)
                .build();
    }


    @PutMapping("/availability")
    public ApiResponse<List<ItemResponse>> updateMenuAvailabilityToggle(
            @RequestBody MenuAvailabilityToggleListRequest request, JwtAuthenticationToken jwtAuthenticationToken) {

        List<ItemResponse> itemResponses = itemService.updateMenuAvailabilityToggle(request, jwtAuthenticationToken);
        return ApiResponse.<List<ItemResponse>>builder()
                .message("Update Menu Availability Toggle Successfully")
                .result(itemResponses)
                .build();
    }
    @PostMapping("/avatar/{itemId}")

    public ApiResponse<String> replaceAvatar(@RequestBody AvatarRequest avatarRequest,@PathVariable Integer itemId){
        return ApiResponse.<String>builder()
                .result(itemService.replaceAvatar(avatarRequest,itemId))
                .build();
    }

    @GetMapping("/chef-recommen")
    public ApiResponse<Page<ItemResponse>> getAllItemsByChefRecommendation(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,

            JwtAuthenticationToken jwtAuthenticationToken) {

        Page<ItemResponse> items = itemService.getAllItemsByChefRecommendation(jwtAuthenticationToken);

        return ApiResponse.<Page<ItemResponse>>builder()
                .message("Items retrieved successfully")
                .result(items)
                .build();
    }

    @GetMapping("/all-items")
    public ApiResponse<Page<ItemResponse>> GetAllItem(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            JwtAuthenticationToken jwtAuthenticationToken) {
        Page<ItemResponse> items = itemService.getAllItems(page, size, jwtAuthenticationToken);
        return ApiResponse.<Page<ItemResponse>>builder()
                .message("Items retrieved successfully")
                .result(items)
                .build();
    }
}
