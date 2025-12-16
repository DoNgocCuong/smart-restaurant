package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Bank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TenantResponse {
    Integer tenantId;
    String nameTenant;
    String logoUrl;
    String phone;
    String address;
    LocalTime openHours;
    LocalTime closeHours;
}
