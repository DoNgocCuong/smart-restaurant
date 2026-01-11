package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getAllReviewByItem(Integer itemId);


}
