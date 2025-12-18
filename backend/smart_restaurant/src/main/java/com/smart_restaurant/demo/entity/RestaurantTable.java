package com.smart_restaurant.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "restaurant_table")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer tableId;
    @Column(name="table_name")
    String tableName;
    Integer capacity;
    Boolean is_active;
    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    private LocalDateTime createAt;
    @UpdateTimestamp
    @Column(name = "update_at")
    private LocalDateTime updateAt;
    @ManyToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;
    @OneToMany(mappedBy = "table" ,cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Order> orders;
}
