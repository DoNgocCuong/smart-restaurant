package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.CustomerRepository;
import com.smart_restaurant.demo.Service.CustomerService;
import com.smart_restaurant.demo.dto.Request.CustomerRequest;
import com.smart_restaurant.demo.dto.Response.CustomerResponse;
import com.smart_restaurant.demo.dto.Response.CustomerResponseDto;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.Customer;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.CustomerMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    AccountRepository accountRepository;
    CustomerMapper customerMapper;
    @Override
    public CustomerResponseDto createCustomer(CustomerRequest customerRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        Account account=accountRepository.findByUsername(jwtAuthenticationToken.getName()).orElseThrow(()-> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        Customer customer=customerMapper.toCustomer(customerRequest);
        customer.setAccount(account);
        account.setIsFirstActivity(false);
        accountRepository.save(account);
        return customerMapper.toCustomerResponseDto(customerRepository.save(customer));
    }
}
