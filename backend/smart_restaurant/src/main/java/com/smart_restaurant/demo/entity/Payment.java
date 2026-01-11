package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer paymentId;
    Double amount;
    @JoinColumn(name = "momo_trans_id")
    String momoTransId;
    @JoinColumn(name = "momo_request_id")
    String momoRequestId;
    @JoinColumn(name = "momo_order_id")
    private String momoOrderId;

    @CreationTimestamp
    LocalDateTime createAt;
    @OneToOne
    @JoinColumn(name = "status_id")
    Status status;
    @OneToOne
    @JoinColumn(name = "order_id")
    Order order;

    @ManyToOne
    @JoinColumn(name = "type_payment_id")
    TypePayment typePayment;

}
