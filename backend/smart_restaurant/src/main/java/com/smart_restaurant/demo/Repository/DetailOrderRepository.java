package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.DetailOrder;
import com.smart_restaurant.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetailOrderRepository extends JpaRepository<DetailOrder,Integer> {
    List<DetailOrder> findByOrder(Order order);
}
