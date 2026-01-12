package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.UpdateStatusReview;
import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.Review;
import org.hibernate.sql.ast.tree.expression.Star;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CustomerMapper.class, ItemMapper.class})
public interface ReviewMapper {

//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    @Mapping(target = "isActive", source = "isActive")
//    void updateReviewStatus(@MappingTarget Review review, UpdateStatusReview updateStatusReview);

    @Mapping(target = "isActive", source = "isActive")
    ReviewResponse toReviewResponse(Review review);

    @Mapping(target = "isActive", source = "isActive")
    List<ReviewResponse> toReviewResponseList(List<Review> reviews);
}
