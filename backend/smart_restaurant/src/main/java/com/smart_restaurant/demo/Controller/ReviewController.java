package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.ReviewService;
import com.smart_restaurant.demo.dto.Request.UpdateStatusReview;
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

    // [1] - Ai cũng get được
    @GetMapping("/{itemId}")
    public ApiResponse<List<ReviewResponse>> getAllReviewByItem(@PathVariable Integer itemId){
        List<ReviewResponse> reviewResponses = reviewService.getAllReviewByItem(itemId);
        return ApiResponse.<List<ReviewResponse>>builder()
                .message("Get All Review By Item")
                .result(reviewResponses)
                .build();
    }

    //[2] Chỉ trong staff, admin mới dùng dược
    @GetMapping("")
    public ApiResponse<List<ReviewResponse>> getAllReviewIsTenant(JwtAuthenticationToken jwtAuthenticationToken){
        List<ReviewResponse> reviewResponses = reviewService.getAllReviewIsTenant(jwtAuthenticationToken);
        return ApiResponse.<List<ReviewResponse>>builder()
                .message("Get All Review In TenAnt")
                .result(reviewResponses)
                .build();
    }

    // Khách : của nó mới xóa được - Tent/Staff cũng xóa được nếu thuộc nhà hàng chính nó
    @PatchMapping("/{reviewId}")
    public ApiResponse<ReviewResponse> updateStatusReview(@PathVariable Integer reviewId, @RequestBody UpdateStatusReview updateStatusReview, JwtAuthenticationToken jwtAuthenticationToken){
        ReviewResponse reviewResponse = reviewService.updateStatusReview(reviewId, updateStatusReview, jwtAuthenticationToken);
        return ApiResponse.<ReviewResponse>builder()
                .message("Update status thanh cong")
                .result(reviewResponse)
                .build();
    }

}
