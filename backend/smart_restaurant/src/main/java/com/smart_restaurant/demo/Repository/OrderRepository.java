package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Payment;
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

    // Tim order cua 1 ban cụ thể
    List<Order> findByTable_TableId(Integer tableId);

    // Tìm order của 1 list bàn
    List<Order> findByTable_TableIdIn(List<Integer> tableIds);

    // Tìm order cua 1 list bàn và lọc theo order
    List<Order> findByTable_TableIdInAndStatus_OrderStatus(List<Integer> tableIds, OrderStatus status);

    // Tim order cua 1 tenant
    List<Order> findByTableTenantTenantId(Integer tenantId);

    // Tìm order của 1 tent của nhân viên đó quản trị
    List<Order> findByTable_Tenant_TenantIdAndTable_TableIdIn(Integer tenantId, List<Integer> tableIds);
    // Tìm order của 1 tent của nhân viên đó quản trị vaf loc theo trang thai
    List<Order> findByTable_Tenant_TenantIdAndTable_TableIdInAndStatus_OrderStatus(Integer tenantId, List<Integer> tableIds, OrderStatus status);

    // Tìm order cua Customer
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
    List<Order>findAllByCustomer_CustomerId(Integer customerId);

    boolean existsByTable_TableIdAndStatus_OrderStatusNotIn(
            Integer tableId,
            List<OrderStatus> statuses
    );



}
