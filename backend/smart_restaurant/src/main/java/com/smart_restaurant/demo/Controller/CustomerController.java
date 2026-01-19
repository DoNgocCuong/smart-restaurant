package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.CustomerService;
import com.smart_restaurant.demo.dto.Request.CustomerRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.CustomerResponseDto;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {
    CustomerService customerService;
    @PostMapping
    public ApiResponse<CustomerResponseDto> createCustomer(@RequestBody CustomerRequest customerRequest, JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<CustomerResponseDto>builder()
                .result(customerService.createCustomer(customerRequest,jwtAuthenticationToken))
                .build();
    }
}

