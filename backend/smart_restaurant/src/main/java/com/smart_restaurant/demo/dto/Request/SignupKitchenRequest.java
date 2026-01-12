package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.RestaurantTable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SignupKitchenRequest {
    @Email(message = "NOT_EMAIL")
    String username;
    @Size(min=6,message = "NOT_ENOUGHT_CHARACTER_PASSWORD")
    String password;

    String name;
    String phone;
    String address;
    String gender;
    Boolean isEmployee;

}
