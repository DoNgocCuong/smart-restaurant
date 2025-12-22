package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Integer> {
    boolean existsByItemNameAndCategoryIn(String itemName, List<Category> category);
    boolean existsByItemNameAndCategoryInAndItemIdNot( String itemName,
                                                       List<Category> category,
                                                       Integer itemId);

    @Query("SELECT DISTINCT i FROM Item i " +
            "JOIN i.category c " +
            "WHERE c.tenant.tenantId = :tenantId")
    List<Item> findAllByTenantId(@Param("tenantId") Integer tenantId);

    @Query("SELECT DISTINCT i FROM Item i " +
            "INNER JOIN i.category c " +
            "WHERE c.tenant.tenantId = :tenantId " +
            "AND i.status = true " +
            "AND (:itemName IS NULL OR LOWER(i.itemName) LIKE LOWER(CONCAT('%', :itemName, '%'))) " +
            "AND (:categoryId IS NULL OR c.categoryId = :categoryId)")
    Page<Item> findItemsByFilters(
            @Param("tenantId") Integer tenantId,
            @Param("itemName") String itemName,
            @Param("categoryId") Integer categoryId,
            Pageable pageable);

    // Query cho POPULAR - sắp xếp theo số lượng đơn hàng
    @Query(value = "SELECT DISTINCT i.* FROM item i " +
            "INNER JOIN item_category ic ON i.itemId = ic.item_id " +
            "INNER JOIN category c ON ic.category_id = c.categoryId " +
            "LEFT JOIN detail_order do ON do.item_id = i.itemId " +
            "WHERE c.tenant_id = :tenantId " +
            "AND i.status = true " +
            "AND (:itemName IS NULL OR LOWER(i.itemName) LIKE LOWER(CONCAT('%', :itemName, '%'))) " +
            "AND (:categoryId IS NULL OR c.categoryId = :categoryId) " +
            "GROUP BY i.itemId " +
            "ORDER BY COUNT(do.detailOrderId) DESC",
            nativeQuery = true)
    Page<Item> findItemsByFiltersPopular(
            @Param("tenantId") Integer tenantId,
            @Param("itemName") String itemName,
            @Param("categoryId") Integer categoryId,
            Pageable pageable);


}
