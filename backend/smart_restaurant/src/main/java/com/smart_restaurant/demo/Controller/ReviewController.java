package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.ReviewService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
    ReviewService reviewService;

    @GetMapping("/{itemId}")
    public ApiResponse<List<ReviewResponse>> getAllReviewByItem(@PathVariable Integer itemId){
        List<ReviewResponse> reviewResponses = reviewService.getAllReviewByItem(itemId);
        return ApiResponse.<List<ReviewResponse>>builder()
                .message("Get all Review By Item")
                .result(reviewResponses)
                .build();
    }

    @DeleteMapping("/{reviewId}")
    public ApiResponse<ReviewResponse> deleteReview(@PathVariable Integer reviewId, JwtAuthenticationToken jwtAuthenticationToken){
        ReviewResponse reviewResponse = reviewService.deleteReview(reviewId, jwtAuthenticationToken);
        return ApiResponse.<ReviewResponse>builder()
                .message("Xóa thanh cong")
                .result(reviewResponse)
                .build();
    }

}
