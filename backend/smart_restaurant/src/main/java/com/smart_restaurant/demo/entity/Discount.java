package com.smart_restaurant.demo.entity;

import com.smart_restaurant.demo.enums.DiscountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Discount")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer discountId;
    Integer value;
    Integer minApply;
    Integer maxApply;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    DiscountType discountType=DiscountType.Fixed;
    @ManyToOne
    @JoinColumn(name = "tenant_id")
    Tenant tenant;
}
