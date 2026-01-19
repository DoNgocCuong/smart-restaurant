package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.*;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.enums.ItemSortType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;


public interface ItemService {
    public ItemResponse createItem(ItemRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    public ItemResponse updateItemById(Integer id, UpdateItemRequest updateItemRequest, JwtAuthenticationToken jwtAuthenticationToken);
    public void deleteItemById(Integer itemId, JwtAuthenticationToken jwtAuthenticationToken);
//    public List<ItemResponse> getAllItemByTenant(JwtAuthenticationToken jwtAuthenticationToken);
    Page<ItemResponse> getAllItems(int page, int size, JwtAuthenticationToken jwtAuthenticationToken);
    public List<ItemResponse> updateMenuAvailabilityToggle( MenuAvailabilityToggleListRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    String replaceAvatar(AvatarRequest avatarRequest,Integer itemId);

    Page<ItemResponse> getAllItemsByChefRecommendation(JwtAuthenticationToken jwtAuthenticationToken);
    Page<ItemResponse> getAllFilter(int page, int size, String itemName, Integer categoryId, Boolean status, ItemSortType sortType, Sort.Direction direction,JwtAuthenticationToken jwtAuthenticationToken);

    ItemResponse updateStatusItem(Integer itemId, UpdateItemStatusRequest updateItemStatusRequest, JwtAuthenticationToken jwtAuthenticationToken);
}