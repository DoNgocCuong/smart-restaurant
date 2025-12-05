package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import com.smart_restaurant.demo.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "username", source = "username")
    @Mapping(target = "is_first_activity",expression = "java(true)")
    @Mapping(target = "is_email_verify",expression = "java(false)")
    Account toAccount(SignupRequest signupRequest);
    SignupResponse toSignupResponse(Account account);
}
