package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "modifier_group")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModifierGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer modifierGroupId;
    private String name;


    @ManyToMany(mappedBy = "modifierGroups", fetch = FetchType.LAZY)
    private List<Item> items = new ArrayList<>();

    @OneToMany(mappedBy = "modifierGroup",cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ModifierOption> options;
    @ManyToOne
    @JoinColumn(name="tenant_id")
    Tenant tenant;
}
