package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Status;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order , Integer> {

    List<Order> findByCustomerName(String customerName);
    List<Order> findByStatusOrderByCreateAtDesc(Status status);
    List<Order> findByTable_TableId(Integer tableId);
    List<Order> findByTableTenantTenantId(Integer tenantId);
    List<Order> findByCustomerCustomerId(Integer customerId);


}
