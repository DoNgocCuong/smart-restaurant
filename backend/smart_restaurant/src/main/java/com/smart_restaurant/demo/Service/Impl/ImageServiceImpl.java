package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.ImageRepository;
import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.Service.ImageService;
import com.smart_restaurant.demo.dto.Request.ImageRequest;
import com.smart_restaurant.demo.dto.Response.ImageResponse;
import com.smart_restaurant.demo.entity.Image;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ImageMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    ItemRepository itemRepository;
    ImageMapper imageMapper;
    @Override
    public List<ImageResponse> uploadImage(Integer itemId , ImageRequest imageRequest){
        Item item = itemRepository.findById(itemId).orElseThrow(()->new AppException(ErrorCode.ITEM_NOT_FOUND));
        List<Image> images=new ArrayList<>();
        for(String url : imageRequest.getUrl()){
            Image image=Image.builder()
                    .url(url)
                    .item(item)
                    .build();
            images.add(image);
        }
        return imageMapper.toImageResponse(imageRepository.saveAll(images));
    }

    @Override
    public String deleteImage(Integer id) {
        Image image=imageRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.ITEM_NOT_FOUND));
        if(image.getItem().getAvatar().getId()==id)
            throw new AppException(ErrorCode.AVARTAR_NOT_DELETE);
        imageRepository.deleteById(id);
        return "delete successfully";
    }
}
