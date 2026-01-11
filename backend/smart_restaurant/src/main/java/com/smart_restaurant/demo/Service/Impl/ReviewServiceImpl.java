package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.Repository.ReviewRepository;
import com.smart_restaurant.demo.Service.ReviewService;
import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.Review;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ReviewMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    ReviewRepository reviewRepository;
    ItemRepository itemRepository;
    ReviewMapper reviewMapper;
    @Override
    public List<ReviewResponse> getAllReviewByItem(Integer itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(()-> new AppException(ErrorCode.ITEM_NOT_FOUND));

        List<Review> review = reviewRepository.findByItem_ItemId(itemId);
        return reviewMapper.toReviewResponseList(review);
    }
}
