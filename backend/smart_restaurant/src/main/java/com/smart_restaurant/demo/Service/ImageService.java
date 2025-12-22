package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.ImageRequest;
import com.smart_restaurant.demo.dto.Response.ImageResponse;

import java.util.List;

public interface ImageService {
    List<ImageResponse> uploadImage(Integer itemId, ImageRequest imageRequest);
    String deleteImage(Integer id);
}
