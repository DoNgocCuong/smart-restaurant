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
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer orderId;

    @Column(name = "customer_name")
    String customerName;

    @Column(name = "is_have_name")
    Boolean isHaveName;

    String special;
    float discount;
    float subtotal;

    Integer tax;
    Float total;
    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
     LocalDateTime createAt;
    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;
    @ManyToOne
    @JoinColumn(name = "table_id")
    RestaurantTable table;

    @ManyToOne
    @JoinColumn(name = "status_id")
    Status status;

    @OneToMany(mappedBy = "order",cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<DetailOrder> detailOrders;

    @ManyToOne
    @JoinColumn(name = "customerId")
    Customer customer;



    @OneToOne(mappedBy = "order")
    Payment payments;
}
