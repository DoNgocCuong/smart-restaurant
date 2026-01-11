package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.dto.Response.ReviewResponse;
import com.smart_restaurant.demo.entity.Review;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByItem_ItemId(Integer itemId);
    List<Review> findByCustomer_CustomerId(Integer customerId);
}
