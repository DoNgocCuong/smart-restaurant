package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount,Integer> {
}
