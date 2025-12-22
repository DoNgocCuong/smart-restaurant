package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.ModifierOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ModifierOptionRepository extends JpaRepository<ModifierOption, Integer> {
    boolean existsByNameAndModifierGroup_ModifierGroupId(String name, Integer modifierGroupId);
    List<ModifierOption> findAllByModifierGroup_ModifierGroupId(Integer modifierGroupId);

    // Lấy cái option của Tenant đó
    Optional<ModifierOption> findByModifierOptionIdAndModifierGroup_Tenant_TenantId(Integer modifierOptionId, Integer tenantId);

    // Lấy cái option của Tenant đó
    List<ModifierOption> findAllByModifierGroup_Tenant_TenantId(Integer tenantId);

    // Kiểm tra xem option có thuộc tenant đó không
    boolean existsByModifierOptionIdAndModifierGroup_Tenant_TenantId(Integer modifierOptionId, Integer tenantId);

    // Lấy option theo name, group và tenant
    Optional<ModifierOption> findByNameAndModifierGroup_ModifierGroupIdAndModifierGroup_Tenant_TenantId(String name, Integer modifierGroupId, Integer tenantId);
}
