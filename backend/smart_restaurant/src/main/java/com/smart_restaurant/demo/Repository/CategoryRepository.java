package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,Integer> {
    Optional<Category> findByCategoryNameAndTenantTenantId(String categoryName, Integer tenantId);
    boolean existsByCategoryNameAndTenantTenantId(String categoryName, Integer tenantId);
    List<Category> findAllByTenant_TenantId(Integer tenantId);
    List<Category> findAllByCategoryIdInAndTenant_TenantId(List<Integer> categoryIds, Integer tenantId);



}
