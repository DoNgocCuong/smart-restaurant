package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TableRepository extends JpaRepository<RestaurantTable,Integer> {
    List<RestaurantTable> findAllByTenant_TenantIdAndActiveTrue(Integer tenantId);
    boolean existsByTableName(String tableName);
}
