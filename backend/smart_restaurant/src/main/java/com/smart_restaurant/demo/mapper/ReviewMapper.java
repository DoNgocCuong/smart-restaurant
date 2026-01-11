package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CustomerMapper.class, ItemMapper.class})
public interface ReviewMapper {


    ReviewResponse toReviewResponse(Review review);

    List<ReviewResponse> toReviewResponseList(List<Review> reviews);
}
