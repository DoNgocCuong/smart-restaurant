package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.SignupCustomerRequest;
import com.smart_restaurant.demo.dto.Response.CustomerResponse;
import com.smart_restaurant.demo.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    Customer toCustomer(SignupCustomerRequest signupCustomerRequest);

    CustomerResponse toCustomerResponse(Customer customer);
}
