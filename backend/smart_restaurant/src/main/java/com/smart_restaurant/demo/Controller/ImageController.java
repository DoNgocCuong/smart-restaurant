package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.ImageService;
import com.smart_restaurant.demo.dto.Request.ImageRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ImageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImageController {
    ImageService imageService;
    @PostMapping("/{itemId}")
    public ApiResponse<List<ImageResponse>> uploadImage(@PathVariable Integer itemId, @RequestBody ImageRequest imageRequest){
        return ApiResponse.<List<ImageResponse>>builder()
                .result(imageService.uploadImage(itemId,imageRequest))
                .build();
    }
    @DeleteMapping("/{imageId}")
    public  ApiResponse<String> deleteImage(@PathVariable Integer imageId){
        return ApiResponse.<String>builder()
                .result(imageService.deleteImage(imageId))
                .build();
    }
}
