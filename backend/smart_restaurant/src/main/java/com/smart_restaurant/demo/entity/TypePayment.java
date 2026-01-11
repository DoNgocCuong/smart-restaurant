package com.smart_restaurant.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "type_payment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer typePaymentId;
    String name;
}
