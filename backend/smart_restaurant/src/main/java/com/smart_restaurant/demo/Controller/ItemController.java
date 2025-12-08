package com.smart_restaurant.demo.Controller;


import com.smart_restaurant.demo.Service.ItemService;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Item;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menu/items")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ItemController {

    ItemService itemService;

    @PostMapping("")
    public ApiResponse<ItemResponse> createItem(@Valid @RequestBody ItemRequest request) {
        ItemResponse item = itemService.createItem(request);
        return ApiResponse.<ItemResponse>builder()
                .message("Item created successfully")
                .result(item)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ItemResponse> updateItemById(@PathVariable Integer id, @Valid @RequestBody UpdateItemRequest updateItemRequest){
        ItemResponse item = itemService.updateItemById(id,updateItemRequest);
        return ApiResponse.<ItemResponse>builder()
                .message("Item created successfully")
                .result(item)
                .build();
    }
}
