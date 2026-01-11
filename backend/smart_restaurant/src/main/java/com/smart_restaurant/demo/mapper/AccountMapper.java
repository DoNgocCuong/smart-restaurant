package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.SignupCustomerRequest;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.AccountResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import com.smart_restaurant.demo.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "username", source = "username")
    @Mapping(target = "isFirstActivity",expression = "java(true)")
    @Mapping(target = "isEmailVerify",expression = "java(false)")
    Account toAccount(SignupRequest signupRequest);
    SignupResponse toSignupResponse(Account account);


    @Mapping(target = "is_active", source = "isActive")
    @Mapping(target = "is_first_activity", source = " isFirstActivity")
    @Mapping(target = "is_email_verify", source = "isEmailVerify")
    AccountResponse toAccountResponse(Account account);
    Account toAccount(SignupCustomerRequest signupRequest);
}
