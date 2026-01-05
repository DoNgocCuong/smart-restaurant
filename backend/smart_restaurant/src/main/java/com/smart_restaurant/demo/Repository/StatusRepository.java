package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status, Integer> {
    Optional<Status> findByOrderStatus(OrderStatus orderStatus);

}
