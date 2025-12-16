package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.TenantService;
import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTenantRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.TenantResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

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


    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<TenantResponse> updateTenant(@PathVariable("id") Integer id, @Valid @RequestBody UpdateTenantRequest updateTenantRequest, JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<TenantResponse>builder()
                .message("Update Teanant successfully")
                .result(tenantService.updateTenant(id,updateTenantRequest,jwtAuthenticationToken))
                .build();
    }

    @GetMapping("/tenant-profile")
    ApiResponse<TenantResponse> getMyProfileTenant(JwtAuthenticationToken jwtAuthenticationToken){

        return ApiResponse.<TenantResponse>builder()
                .message("Get Profile Teanant successfully")
                .result(tenantService.getMyProfileTenant(jwtAuthenticationToken))
                .build();

    }
}
