package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Entity
@Table(name = "Employee")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer employeeId;
    String name;
    String phone;
    String address;
    String gender;
    @Column(name = "is_employee")
    Boolean isEmployee;
    @OneToOne
    @JoinColumn(name="account_id")
    Account account;
    @ManyToMany
    @JoinTable(
            name = "Employee_table",
            joinColumns = @JoinColumn(name="employee_id"),
            inverseJoinColumns=@JoinColumn(name="table_id")
    )
    List<RestaurantTable> restaurantTables;
}
