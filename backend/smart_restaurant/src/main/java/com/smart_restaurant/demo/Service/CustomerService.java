package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.CustomerRequest;
import com.smart_restaurant.demo.dto.Response.CustomerResponse;
import com.smart_restaurant.demo.dto.Response.CustomerResponseDto;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface CustomerService {
    CustomerResponseDto createCustomer(CustomerRequest customerRequest, JwtAuthenticationToken jwtAuthenticationToken);
}
