package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    String imageUrl;
    boolean status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "modifier_group_item",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "modifierGroupId")
    )
    private List<ModifierGroup> modifierGroups;

}

