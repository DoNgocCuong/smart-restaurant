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

    @ManyToMany(fetch =FetchType.EAGER)
    @JoinTable(
            name = "category_item",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    List<Category> categories;
    @ManyToOne
    @JoinColumn(name="modifier_group_id")
    ModifierGroup modifierGroup;

}

