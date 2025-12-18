package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.SignupRequest;
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
}
