package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, Integer> {

}
