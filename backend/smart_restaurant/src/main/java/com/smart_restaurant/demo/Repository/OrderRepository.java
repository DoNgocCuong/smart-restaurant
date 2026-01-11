package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.enums.OrderStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order , Integer> {
    List<Order> findByCustomerName(String customerName);

    List<Order> findByStatusOrderByCreateAtDesc(Status status);

    List<Order> findByTable_TableId(Integer tableId);
    List<Order> findByTableTenantTenantId(Integer tenantId);
    List<Order> findByCustomerCustomerId(Integer customerId);
    List<Order> findByTable_Tenant_TenantIdAndStatus_OrderStatusNot(
            Integer tenantId,
            OrderStatus status
    );
    List<Order> findByTable_Tenant_TenantIdAndStatus_OrderStatus(
            Integer tenantId,
            OrderStatus status
    );
    List<Order> findByTable_TableIdAndStatus_OrderStatusNot(
            Integer tableId,
            OrderStatus status
    );

    boolean existsByTable_TableIdAndStatus_OrderStatusNotIn(
            Integer tableId,
            List<OrderStatus> statuses
    );



}
