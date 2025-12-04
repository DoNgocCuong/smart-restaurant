package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission,Integer> {
}
