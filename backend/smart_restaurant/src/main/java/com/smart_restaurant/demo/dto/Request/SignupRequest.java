package com.smart_restaurant.demo.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SignupRequest {
    @Email(message = "NOT_EMAIL")
    String username;
    @Size(min=6,message = "NOT_ENOUGHT_CHARACTER_PASSWORD")
    String password;
}
