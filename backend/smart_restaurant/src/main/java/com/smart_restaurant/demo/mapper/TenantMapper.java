package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.dto.Response.TenantResponse;
import com.smart_restaurant.demo.entity.Tenant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TenantMapper {
    @Mapping(target = "phone", source = "phone")
    Tenant toTenant(TenantRequest tenantRequest);
    TenantResponse toTenantResponse(Tenant tenant);
}
