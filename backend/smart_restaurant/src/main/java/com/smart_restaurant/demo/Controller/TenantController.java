package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.TenantService;
import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.TenantResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tenant")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TenantController {
    TenantService tenantService;
    @PostMapping("/create-tenant")
    public ApiResponse<TenantResponse> createTenant(@RequestBody TenantRequest tenantRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        return ApiResponse.<TenantResponse>builder()
                .result(tenantService.createTenant(tenantRequest, jwtAuthenticationToken))
                .build();
    }
}
