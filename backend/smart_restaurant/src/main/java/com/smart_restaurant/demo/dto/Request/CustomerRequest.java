package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.enums.Genders;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CustomerRequest {
    String name;
    String phone;
    String address;
    Genders gender;
}
