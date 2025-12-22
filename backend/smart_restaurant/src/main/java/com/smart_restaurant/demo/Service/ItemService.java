package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.dto.Request.AvatarRequest;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.MenuAvailabilityToggleListRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ImageResponse;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Image;
import com.smart_restaurant.demo.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


public interface ItemService {
    public ItemResponse createItem(ItemRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    public ItemResponse updateItemById(Integer id, UpdateItemRequest updateItemRequest, JwtAuthenticationToken jwtAuthenticationToken);
    public void deleteItemById(Integer itemId, JwtAuthenticationToken jwtAuthenticationToken);
//    public List<ItemResponse> getAllItemByTenant(JwtAuthenticationToken jwtAuthenticationToken);
    Page<ItemResponse> getAllItems(int page, int size, String itemName, Integer categoryId, String sortBy, JwtAuthenticationToken jwtAuthenticationToken);
    public List<ItemResponse> updateMenuAvailabilityToggle( MenuAvailabilityToggleListRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    String replaceAvatar(AvatarRequest avatarRequest,Integer itemId);
}