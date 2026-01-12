package com.smart_restaurant.demo.dto.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UpdateStatusReview {
    @JsonProperty("isActive")
    Boolean isActive;
}
