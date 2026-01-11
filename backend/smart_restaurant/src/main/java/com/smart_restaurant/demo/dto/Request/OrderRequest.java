package com.smart_restaurant.demo.dto.Request;

import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.enums.Genders;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OrderRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;
    @NotBlank(message = "Phone is required")
    private String phone;
    private String address;
    private Genders gender;
    Account account;

    private Integer tableId;
    private String special;
    private List<DetailOrderRequest> detailOrders;
}
