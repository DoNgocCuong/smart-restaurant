package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.AvatarRequest;
import com.smart_restaurant.demo.dto.Request.ImageRequest;
import com.smart_restaurant.demo.dto.Response.ImageResponse;
import com.smart_restaurant.demo.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    @Mapping(source = "Id", target = "id")
    List<ImageResponse> toImageResponse(List<Image> images);
    Image toImage(AvatarRequest avatarRequest);
}
