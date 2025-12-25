package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.ImageRequest;
import com.smart_restaurant.demo.dto.Response.ImageResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface ImageService {
    List<ImageResponse> uploadImage(Integer itemId, ImageRequest imageRequest);
    String deleteImage(Integer id);
    List<ImageResponse> getAllImage(Integer itemId,JwtAuthenticationToken jwtAuthenticationToken);
}
