package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.ReviewService;
import com.smart_restaurant.demo.dto.Request.ReviewRequest;
import com.smart_restaurant.demo.dto.Request.UpdateStatusReview;
import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.*;
import com.smart_restaurant.demo.enums.Roles;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ReviewMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.sql.Update;
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
    AccountService accountService;
    TenantRepository tenantRepository;
    OrderRepository orderRepository;
    DetailOrderRepository detailOrderRepository;
    @Override
    public List<ReviewResponse> getAllReviewByItem(Integer itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(()-> new AppException(ErrorCode.ITEM_NOT_FOUND));

        List<Review> review = reviewRepository.findByItem_ItemIdAndIsActive(itemId, true);
        return reviewMapper.toReviewResponseList(review);
    }

    @Override
    public List<ReviewResponse> getAllReviewIsTenant(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        // Lay account tu username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        Integer accountId = account.getAccountId();

        // Lấy Tenant ID từ cái account đó để biết account đó của Tenant nào
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Lay Tenant đó - Check tenant đó có không
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        // Lấy Review cua tenant đó
        List<Review> reviews = reviewRepository.findByItem_Category_Tenant_TenantId(tenantId);

        return reviewMapper.toReviewResponseList(reviews);
    }

    @Override
    public ReviewResponse updateStatusReview(Integer reviewId, UpdateStatusReview updateStatusReview, JwtAuthenticationToken jwtAuthenticationToken) {


        String username = jwtAuthenticationToken.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        String scope = (String) jwtAuthenticationToken.getTokenAttributes().get("scope");

        if (scope.contains("ROLE_CUSTOMER")) {
            validateCustomerOwnsReview(review, account.getAccountId());
        } else if (scope.contains("ROLE_STAFF") || scope.contains("ROLE_TENANT_ADMIN")) {
            validateTenantOwnsReview(review, username);
        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        System.out.println("UpdateStatusReview: " + updateStatusReview);
        System.out.println("isActive value: " + updateStatusReview.getIsActive());

        if (updateStatusReview.getIsActive() != null) {
            review.setIsActive(updateStatusReview.getIsActive());
            System.out.println("Updated isActive to: " + review.getIsActive());
        } else {
            System.out.println("isActive is NULL - không update");
        }
        reviewRepository.save(review);
        return reviewMapper.toReviewResponse(review);

    }




    private void validateCustomerOwnsReview(Review review, Integer accountId) {
        Customer customer = customerRepository
                .findByAccountAccountId(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Check review có customer hay không
        if (review.getCustomer() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (!review.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    private void validateTenantOwnsReview(Review review, String username) {


        Integer tenantId = accountService.getTenantIdByUsername(username);

        boolean belongsToTenant = reviewRepository
                .existsByReviewIdAndItem_Category_Tenant_TenantId(review.getReviewId(), tenantId);

        if (!belongsToTenant) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

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
        review.setIsActive(true);
        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }
}
