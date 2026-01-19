package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.CustomerService;
import com.smart_restaurant.demo.dto.Request.CustomerRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.CustomerResponseDto;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping
    public  ApiResponse<CustomerResponseDto> getProfile(JwtAuthenticationToken jwtAuthenticationToken){
        return  ApiResponse.<CustomerResponseDto>builder()
                .result(customerService.getProfile(jwtAuthenticationToken))
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<CustomerResponseDto> getMyProfile( JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<CustomerResponseDto>builder()
                .message("Get My Profile thanh cong")
                .result(customerService.getMyProfile(jwtAuthenticationToken))
                .build();
    }

}

