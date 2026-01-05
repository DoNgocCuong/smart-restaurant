package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByAccount_Username(String username);
    Optional<Customer> findByAccountAccountId(Integer accountId);
}
