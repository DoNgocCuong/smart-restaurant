package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order , Integer> {
}
