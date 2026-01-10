package com.smart_restaurant.demo.entity;

import com.smart_restaurant.demo.enums.Genders;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Customer")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer customerId;
    String name;
    String phone;
    String address;
    @Enumerated(EnumType.STRING)
    Genders gender;
    @OneToOne
    @JoinColumn(name="account_id")
    Account account;
}
