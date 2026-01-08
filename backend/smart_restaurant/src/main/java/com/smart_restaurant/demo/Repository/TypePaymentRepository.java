package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Payment;
import com.smart_restaurant.demo.entity.TypePayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypePaymentRepository extends JpaRepository<TypePayment, Integer> {
    Optional<TypePayment> findByName(String name);

}
