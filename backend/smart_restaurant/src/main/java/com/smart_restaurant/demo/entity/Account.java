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
@Table(name = "Account")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer accountId;
    String username;
    String password;
    boolean is_first_activity;
    boolean is_email_verify;
    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    LocalDateTime createAt;
    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;
    @ManyToOne
    @JoinColumn(name="tenant_id")
    Tenant tenant;
    @ManyToMany
    @JoinTable(
            name = "account_role",
            joinColumns = @JoinColumn(name="account_id"),
            inverseJoinColumns=@JoinColumn(name="role_id")
    )
    List<Role>roles;
}
