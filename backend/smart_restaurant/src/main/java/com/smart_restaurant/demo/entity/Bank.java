package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Bank")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer bankId;
    String nameBank;
    String bankNumber;
    String bankAccountHolderName;
    @OneToOne
    @JoinColumn(name = "tenantId")
    Tenant tenant;
}
