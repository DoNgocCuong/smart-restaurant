package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByMomoRequestId(String momoRequestId);
    Optional<Payment> findByOrder_OrderId(Integer orderId);
    Optional<Payment> findByMomoOrderId(String momoOrderId);
}
