package com.smart_restaurant.demo.Controller;


import com.smart_restaurant.demo.Service.ItemService;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.MenuAvailabilityToggleListRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Item;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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
    public ApiResponse<List<ItemResponse>> getAllItemByTenat(JwtAuthenticationToken jwtAuthenticationToken){

        List<ItemResponse> itemResponse = itemService.getAllItemByTenant(jwtAuthenticationToken);
        return ApiResponse.<List<ItemResponse>>builder()
                .message("Item getAll successfully")
                .result(itemResponse)
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

}
