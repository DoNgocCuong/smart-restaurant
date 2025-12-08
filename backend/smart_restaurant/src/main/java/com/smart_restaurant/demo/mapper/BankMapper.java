package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.entity.Bank;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BankMapper {
    Bank toBank(TenantRequest tenantRequest);
}
