package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "InvalidatedToken")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvalidatedToken {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "token", nullable = false,length = 1000)
    private String token;

    @Column(name = "expire_time", nullable = false)
    private Date expireTime;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
}
