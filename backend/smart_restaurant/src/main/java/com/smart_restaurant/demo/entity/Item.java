package com.smart_restaurant.demo.entity;

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
@Table(name = "item")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer itemId;

    String itemName;
    String description;
    Double price;
    @Column(name = "is_kitchen")
    Boolean isKitchen;
    Boolean status;
    @Column(name = "quantity_sold")
    Integer quantitySold=0;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_id")
    Image avatar;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "item_category",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    List<Category> category;



    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "modifier_group_item",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "modifierGroupId")
    )
    private List<ModifierGroup> modifierGroups;
    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    LocalDateTime createAt;
    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;

}

