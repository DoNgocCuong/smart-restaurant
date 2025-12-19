package com.smart_restaurant.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
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
    @Column(name="phone")
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
    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "tenant" ,cascade = CascadeType.REMOVE, orphanRemoval = true)
    List<RestaurantTable> table;
    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "tenant",cascade = CascadeType.REMOVE, orphanRemoval = true)
    List<Account> account;
    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "tenant",cascade = CascadeType.REMOVE, orphanRemoval = true)
    List<ModifierGroup> modifierGroups ;
}
