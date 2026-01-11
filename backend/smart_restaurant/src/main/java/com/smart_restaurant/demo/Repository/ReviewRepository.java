package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Review;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
}
