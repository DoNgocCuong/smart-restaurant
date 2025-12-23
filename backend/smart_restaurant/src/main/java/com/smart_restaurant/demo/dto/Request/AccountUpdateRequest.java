package com.smart_restaurant.demo.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import software.amazon.awssdk.annotations.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AccountUpdateRequest {
    @Email(message = "NOT_EMAIL")
    private String userName;
    @Size(min=6,message = "NOT_ENOUGHT_CHARACTER_PASSWORD")
    private String password;

}
