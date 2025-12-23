package com.smart_restaurant.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.smart_restaurant.demo.enums.SelectionType;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "selection_type")
    private SelectionType selectionType;
    @Column(name = "is_required")
    private Boolean isRequired;

    @JsonBackReference
    @ManyToMany(mappedBy = "modifierGroups", fetch = FetchType.LAZY)
    private List<Item> items = new ArrayList<>();
    @JsonBackReference
    @OneToMany(mappedBy = "modifierGroup",cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ModifierOption> options;
    @ManyToOne
    @JoinColumn(name="tenant_id")
    Tenant tenant;
}
