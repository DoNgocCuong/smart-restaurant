package com.smart_restaurant.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "detail_order")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detailOrderId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;


    private Integer quantity;
    private Double price;

    @Column(name = "is_approved")
    private Boolean isApproved;

    @ManyToMany(fetch = FetchType.EAGER )
    @JoinTable(
            name="Detail_order_modifier_option",
            joinColumns = @JoinColumn(name = "detail_order_id"),
            inverseJoinColumns = @JoinColumn(name = "modifier_option_id")
    )
    private List<ModifierOption> modifies;
    @ManyToOne
    @JoinColumn(name = "item_id")
    Item item;
}
