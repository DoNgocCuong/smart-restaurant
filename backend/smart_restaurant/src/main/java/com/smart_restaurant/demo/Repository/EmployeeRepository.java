package com.smart_restaurant.demo.Repository;

import com.smart_restaurant.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {
    Optional<Employee> findByAccount_Username(String username);
}
