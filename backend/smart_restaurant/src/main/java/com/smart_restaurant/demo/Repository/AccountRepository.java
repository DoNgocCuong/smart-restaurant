package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account,Integer> {
    Optional<Account> findByUsername(String username);
    Boolean existsByUsername(String username);

    @Query("SELECT a.tenant.tenantId FROM Account a WHERE a.username = :username")
    Optional<Integer> findTenantIdByUsername(@Param("username") String username);


    boolean existsByUsernameAndTenant_TenantId(String username, Integer tenantId);
}
