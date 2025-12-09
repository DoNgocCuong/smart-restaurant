package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.MenuAvailabilityToggleListRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Item;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


public interface ItemService {
    public ItemResponse createItem(ItemRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    public ItemResponse updateItemById(Integer id, UpdateItemRequest updateItemRequest, JwtAuthenticationToken jwtAuthenticationToken);
    public void deleteItemById(Integer itemId, JwtAuthenticationToken jwtAuthenticationToken);
    public List<ItemResponse> getAllItemByTenant(JwtAuthenticationToken jwtAuthenticationToken);
    public List<ItemResponse> updateMenuAvailabilityToggle( MenuAvailabilityToggleListRequest request, JwtAuthenticationToken jwtAuthenticationToken);
}