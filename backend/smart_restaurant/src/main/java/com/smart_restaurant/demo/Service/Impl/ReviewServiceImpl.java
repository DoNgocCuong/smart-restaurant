package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.CustomerRepository;
import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.Repository.ReviewRepository;
import com.smart_restaurant.demo.Service.ReviewService;
import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.Customer;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.Review;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ReviewMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    CustomerRepository customerRepository;
    AccountRepository accountRepository;
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
}
