package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Payment;
import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.enums.OrderStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
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



    // =========================================================
    // 1. DOANH THU THEO NGÀY (từ ngày -> đến ngày) + STATUS
    // =========================================================
    @Query("""
        SELECT DATE(o.createAt), SUM(o.total)
        FROM Order o
        WHERE o.createAt BETWEEN :from AND :to
          AND o.status.statusId = :statusId
        GROUP BY DATE(o.createAt)
        ORDER BY DATE(o.createAt)
    """)
    List<Object[]> revenueByDateRange(@Param("from") LocalDateTime from,
                                      @Param("to") LocalDateTime to,
                                      @Param("statusId") int statusId);


    // =========================================================
    // 2. DOANH THU THEO TUẦN TRONG KHOẢNG THÁNG + STATUS
    // (MySQL native query)
    // =========================================================
    @Query(value = """
        SELECT 
          YEAR(o.create_at)   AS y,
          MONTH(o.create_at)  AS m,
          WEEK(o.create_at, 1)
            - WEEK(DATE_SUB(o.create_at, INTERVAL DAY(o.create_at)-1 DAY), 1) + 1 
            AS weekInMonth,
          SUM(o.total) AS revenue
        FROM orders o
        WHERE 
          YEAR(o.create_at) = :year
          AND MONTH(o.create_at) BETWEEN :fromMonth AND :toMonth
          AND o.status_id = :statusId
        GROUP BY y, m, weekInMonth
        ORDER BY y, m, weekInMonth
    """, nativeQuery = true)
    List<Object[]> revenueByWeekInMonthRange(@Param("year") int year,
                                             @Param("fromMonth") int fromMonth,
                                             @Param("toMonth") int toMonth,
                                             @Param("statusId") int statusId);


    // =========================================================
    // 3. DOANH THU THEO THÁNG TRONG KHOẢNG NĂM + STATUS
    // =========================================================
    @Query("""
        SELECT YEAR(o.createAt), MONTH(o.createAt), SUM(o.total)
        FROM Order o
        WHERE YEAR(o.createAt) BETWEEN :fromYear AND :toYear
          AND o.status.statusId = :statusId
        GROUP BY YEAR(o.createAt), MONTH(o.createAt)
        ORDER BY YEAR(o.createAt), MONTH(o.createAt)
    """)
    List<Object[]> revenueByYearRange(@Param("fromYear") int fromYear,
                                      @Param("toYear") int toYear,
                                      @Param("statusId") int statusId);








}
