package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.DetailOrder;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DetailOrderRepository extends JpaRepository<DetailOrder,Integer> {
    List<DetailOrder> findByOrder(Order order);
    List<DetailOrder> findByOrder_OrderId(Integer orderId);
    Boolean existsByOrder_OrderIdAndItem_ItemId(Integer orderId,Integer itemId);



    // ===================== TOP ITEM THEO NGÀY =====================
    @Query(value = """
        SELECT dday, itemName, revenue
        FROM (
            SELECT 
                DATE(o.create_at) AS dday,
                i.itemName,
                SUM(d.quantity * d.price) AS revenue,
                ROW_NUMBER() OVER (
                    PARTITION BY DATE(o.create_at)
                    ORDER BY SUM(d.quantity * d.price) DESC
                ) AS rn
            FROM detail_order d
            JOIN orders o  ON d.order_id  = o.orderId
            JOIN item i    ON d.item_id   = i.itemId
            JOIN status s  ON o.status_id = s.statusId
            WHERE 
                s.orderStatus = :status
                AND o.create_at BETWEEN :from AND :to
            GROUP BY 
                DATE(o.create_at),
                i.itemName
        ) t
        WHERE rn = 1
        ORDER BY dday
        """, nativeQuery = true)
    List<Object[]> topItemRevenueByDay(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") String status
    );


    // ===================== TOP ITEM THEO TUẦN (TRONG KHOẢNG THÁNG) =====================
    @Query(value = """
        SELECT y, m, weekInMonth, itemName, revenue
        FROM (
            SELECT 
                YEAR(o.create_at)  AS y,
                MONTH(o.create_at) AS m,
                WEEK(o.create_at,1)
                  - WEEK(DATE_SUB(o.create_at, INTERVAL DAY(o.create_at)-1 DAY),1) + 1
                  AS weekInMonth,
                i.itemName,
                SUM(d.quantity * d.price) AS revenue,
                ROW_NUMBER() OVER (
                    PARTITION BY 
                        YEAR(o.create_at),
                        MONTH(o.create_at),
                        WEEK(o.create_at,1)
                          - WEEK(DATE_SUB(o.create_at, INTERVAL DAY(o.create_at)-1 DAY),1) + 1
                    ORDER BY SUM(d.quantity * d.price) DESC
                ) AS rn
            FROM detail_order d
            JOIN orders o  ON d.order_id  = o.orderId
            JOIN item i    ON d.item_id   = i.itemId
            JOIN status s  ON o.status_id = s.statusId
            WHERE 
                s.orderStatus = :status
                AND YEAR(o.create_at) = :year
                AND MONTH(o.create_at) BETWEEN :fromMonth AND :toMonth
            GROUP BY 
                YEAR(o.create_at),
                MONTH(o.create_at),
                weekInMonth,
                i.itemName
        ) t
        WHERE rn = 1
        ORDER BY y, m, weekInMonth
        """, nativeQuery = true)
    List<Object[]> topItemRevenueByWeek(
            @Param("year") int year,
            @Param("fromMonth") int fromMonth,
            @Param("toMonth") int toMonth,
            @Param("status") String status
    );


    // ===================== TOP ITEM THEO THÁNG =====================
    @Query(value = """
        SELECT y, m, itemName, revenue
        FROM (
            SELECT 
                YEAR(o.create_at)  AS y,
                MONTH(o.create_at) AS m,
                i.itemName,
                SUM(d.quantity * d.price) AS revenue,
                ROW_NUMBER() OVER (
                    PARTITION BY YEAR(o.create_at), MONTH(o.create_at)
                    ORDER BY SUM(d.quantity * d.price) DESC
                ) AS rn
            FROM detail_order d
            JOIN orders o  ON d.order_id  = o.orderId
            JOIN item i    ON d.item_id   = i.itemId
            JOIN status s  ON o.status_id = s.statusId
            WHERE 
                s.orderStatus = :status
                AND YEAR(o.create_at) BETWEEN :fromYear AND :toYear
            GROUP BY 
                YEAR(o.create_at),
                MONTH(o.create_at),
                i.itemName
        ) t
        WHERE rn = 1
        ORDER BY y, m
        """, nativeQuery = true)
    List<Object[]> topItemRevenueByMonth(
            @Param("fromYear") int fromYear,
            @Param("toYear") int toYear,
            @Param("status") String status
    );
}
