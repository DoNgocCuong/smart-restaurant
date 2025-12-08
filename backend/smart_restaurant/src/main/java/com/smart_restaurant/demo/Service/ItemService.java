package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.dto.Request.ItemRequest;
import com.smart_restaurant.demo.dto.Request.UpdateItemRequest;
import com.smart_restaurant.demo.dto.Response.ItemResponse;
import com.smart_restaurant.demo.entity.Item;


public interface ItemService {
    public ItemResponse createItem(ItemRequest request);
    public ItemResponse updateItemById(Integer id, UpdateItemRequest updateItemRequest);
}
