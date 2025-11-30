package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Tenant")
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer tenantId;
    @Column(name="name_tenant")
    String nameTenant;
    @Column(name = "logo_url")
    String logoUrl;
    @Column(name="phone",unique = true,nullable = false)
    String phone;
    @Column(name="address")
    String address;
    @Column(name = "open_hours")
    LocalTime openHours;
    @Column(name = "close_hours")
    LocalTime closeHours;
    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    private LocalDateTime createAt;
    @UpdateTimestamp
    @Column(name = "update_at")
    private LocalDateTime updateAt;
    @OneToMany(mappedBy = "tenant" ,cascade = CascadeType.REMOVE, orphanRemoval = true)
    List<RestaurantTable> table;
    @OneToMany(mappedBy = "tenant",cascade = CascadeType.REMOVE, orphanRemoval = true)
    List<RestaurantTable> account;
}
