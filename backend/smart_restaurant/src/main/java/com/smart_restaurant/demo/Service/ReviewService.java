package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getAllReviewByItem(Integer itemId);
    ReviewResponse deleteReview(Integer reviewId, JwtAuthenticationToken jwtAuthenticationToken);
    ReviewResponse deleteReviewByTent(Integer reviewId);


}
