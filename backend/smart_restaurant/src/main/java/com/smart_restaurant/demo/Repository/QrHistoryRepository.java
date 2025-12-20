package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.QrHistory;
import com.smart_restaurant.demo.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QrHistoryRepository extends JpaRepository<QrHistory, Integer> {

    Optional<QrHistory> findByRestaurantTable_TableIdAndActiveTrue(Integer tableId);

    boolean existsByRestaurantTable_TableIdAndActiveTrue(Integer tableId);

    List<QrHistory> findAllByRestaurantTable_Tenant_TenantIdAndActiveTrue(Integer tenantId);
    Optional<QrHistory> findByRestaurantTable_TableIdAndToken(Integer tableId, String token);
    Optional<QrHistory> findByRestaurantTable_TableIdAndRestaurantTable_Tenant_TenantIdAndActiveTrue(Integer tableId,Integer tenantId);
}


