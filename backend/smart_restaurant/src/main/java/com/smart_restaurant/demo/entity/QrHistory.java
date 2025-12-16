package com.smart_restaurant.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Qr_History")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer qrId;
    String qr_url;
    boolean isActive;
    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    LocalDateTime createAt;
    @UpdateTimestamp
    @Column(name = "update_at")
    LocalDateTime updateAt;
    @ManyToOne
    @JoinColumn(name = "tenantId")
    Tenant tenant;
}
