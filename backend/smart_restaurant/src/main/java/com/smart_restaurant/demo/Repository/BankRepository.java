package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank,Integer> {
    Bank findByTenant_TenantId(Integer tenantId);
}
