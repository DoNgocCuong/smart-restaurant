package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.ReviewService;
import com.smart_restaurant.demo.dto.Request.ReviewRequest;
import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.*;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ReviewMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    ReviewRepository reviewRepository;
    ItemRepository itemRepository;
    ReviewMapper reviewMapper;
    CustomerRepository customerRepository;
    AccountRepository accountRepository;
    OrderRepository orderRepository;
    DetailOrderRepository detailOrderRepository;
    @Override
    public List<ReviewResponse> getAllReviewByItem(Integer itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(()-> new AppException(ErrorCode.ITEM_NOT_FOUND));

        List<Review> review = reviewRepository.findByItem_ItemId(itemId);
        return reviewMapper.toReviewResponseList(review);
    }

    @Override
    public ReviewResponse deleteReview(Integer reviewId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        // lay account tu username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        Integer accountId = account.getAccountId();

        // Tim customer boi account
        Customer customer = customerRepository.findByAccountAccountId(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        Integer customerId = customer.getCustomerId();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        // Check Review có của nó không
        if (!review.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        reviewRepository.deleteById(reviewId);
        return reviewMapper.toReviewResponse(review);

    }

    @Override
    public ReviewResponse deleteReviewByTent(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        reviewRepository.deleteById(reviewId);
        return reviewMapper.toReviewResponse(review);
    }

    @Override
    public ReviewResponse createReview(Integer customerId, ReviewRequest reviewRequest) {
        Customer customer=customerRepository.findById(customerId).orElseThrow(()->new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
        List<Order> orders=orderRepository.findAllByCustomer_CustomerId(customerId);
        Item item=itemRepository.findById(reviewRequest.getItemId()).orElseThrow(()->new AppException(ErrorCode.ITEM_NOT_FOUND));
        boolean hasBoughtItem = false;
        for(Order order:orders){
            if(detailOrderRepository.existsByOrder_OrderIdAndItem_ItemId(order.getOrderId(),reviewRequest.getItemId())){
                hasBoughtItem=true;
                break;
            }
        }
        if (hasBoughtItem == false)
            throw new AppException(ErrorCode.CUSTOMER_NOT_ORDER_ITEM);
        Review review=reviewMapper.toReview(reviewRequest);
        review.setCustomer(customer);
        review.setItem(item);
        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }
}
