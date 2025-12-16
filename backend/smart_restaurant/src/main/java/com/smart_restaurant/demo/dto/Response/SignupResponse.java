package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SignupResponse {
    String username;
    boolean is_first_activity;
    boolean is_email_verify;
    List<Role> roles;
    LocalDateTime createAt;
    LocalDateTime updateAt;
}
