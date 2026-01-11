package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.ReviewService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
