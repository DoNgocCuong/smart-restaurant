

package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.RestaurantTable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<RestaurantTable,Integer> {
    Optional<RestaurantTable> findByTableName(String tableName);
    Page<RestaurantTable> findAllByTenant_TenantId(Integer tenantId, Pageable pageable);
    List<RestaurantTable> findAllByTenant_TenantIdAndActiveTrue(Integer tenantId);
    boolean existsByTableName(String tableName);
}
