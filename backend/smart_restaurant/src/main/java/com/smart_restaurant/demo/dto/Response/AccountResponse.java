package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Role;
import com.smart_restaurant.demo.entity.Tenant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AccountResponse {
    String username;
    String password;
    Boolean is_first_activity;
    Boolean is_email_verify;
    Tenant tenant;
    List<Role> roles;
    LocalDateTime createAt;
    LocalDateTime updateAt;
}
