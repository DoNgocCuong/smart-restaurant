package com.smart_restaurant.demo.dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AccountUpdateIsActiveRequest {

    private Boolean isActive;
}
