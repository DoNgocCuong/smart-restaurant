package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.Review;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByItem_ItemIdAndIsActive(Integer itemId, Boolean isActive);
    List<Review> findByCustomer_CustomerIdAndIsActive(Integer customerId, Boolean isActive);
    List<Review> findByItem_Category_Tenant_TenantId(Integer tenantId);
    boolean existsByReviewIdAndItem_Category_Tenant_TenantId(Integer reviewId, Integer tenantId);

}
