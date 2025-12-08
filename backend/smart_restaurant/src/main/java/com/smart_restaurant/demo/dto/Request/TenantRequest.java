package com.smart_restaurant.demo.dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TenantRequest {

    String nameTenant;
    String logoUrl;
    String phone;
    String address;
    LocalTime openHours;
    LocalTime closeHours;
    String nameBank;
    String bankNumber;
    String bankAccountHolderName;
}
