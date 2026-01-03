package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order , Integer> {
    List<Order> findByCustomerId(Integer customerId);
    List<Order> findByStatusOrderByCreateAtDesc(Status status);
}
