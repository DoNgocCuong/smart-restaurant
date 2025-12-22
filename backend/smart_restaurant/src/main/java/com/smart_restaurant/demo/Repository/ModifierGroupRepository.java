package com.smart_restaurant.demo.Repository;


import com.smart_restaurant.demo.entity.Category;
import com.smart_restaurant.demo.entity.ModifierGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModifierGroupRepository extends JpaRepository<ModifierGroup,Integer> {
    boolean existsByNameAndTenantTenantId(String name, Integer tenantId);
    List<ModifierGroup> findAllByTenant_TenantId(Integer modifierGroupId);
    List<ModifierGroup> findAllByModifierGroupIdInAndTenantTenantId(List<Integer> modifierGroupIds, Integer tenantId);
}
