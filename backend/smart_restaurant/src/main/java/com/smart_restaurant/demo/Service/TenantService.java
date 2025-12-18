package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTenantRequest;
import com.smart_restaurant.demo.dto.Response.TenantResponse;
import com.smart_restaurant.demo.entity.Tenant;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface TenantService {
    TenantResponse createTenant(TenantRequest tenantRequest, JwtAuthenticationToken jwtAuthenticationToken);
    Tenant tenantId(JwtAuthenticationToken jwtAuthenticationToken);
    TenantResponse updateTenant(Integer tenantId, UpdateTenantRequest updateTenantRequest, JwtAuthenticationToken jwtAuthenticationToken);
    TenantResponse getMyProfileTenant(JwtAuthenticationToken jwtAuthenticationToken);
}