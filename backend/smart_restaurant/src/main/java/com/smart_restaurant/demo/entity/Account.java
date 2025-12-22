package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.*;
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
    @Column(name = "is_first_activity")
    Boolean isFirstActivity;
    @Column(name="is_email_verify")
    Boolean isEmailVerify;
    @Column(name = "is_customer")
    Boolean isCustomer;
    @Column(name = "is_active")
    Boolean isActive;
    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    LocalDateTime createAt;
    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;

    @ToString.Exclude
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
