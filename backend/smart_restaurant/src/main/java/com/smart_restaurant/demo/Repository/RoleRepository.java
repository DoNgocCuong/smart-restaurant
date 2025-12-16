package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Integer> {
    Optional<Role> findByName(String s);
    boolean existsByName(String roleName);
    List<Role> findAllByName(String name);
}
