package com.smart_restaurant.demo.Controller;

import com.nimbusds.jose.JOSEException;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.dto.Request.AccountUpdateIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.AccountUpdateRequest;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.AccountResponse;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountController {
    AccountService accountService;

    @PostMapping("/create-account-admin")
    ApiResponse<SignupResponse> createAdmin(@RequestBody @Valid SignupRequest signupRequest) throws MessagingException, JOSEException{
        return ApiResponse.<SignupResponse>builder()
                .message("tạo thành công accout admin")
                .result(accountService.createAccountAdmin(signupRequest))
                .build();
    }

    @GetMapping("/all-admin")
    ApiResponse<List<AccountResponse>> getAllAdmin(){
        return ApiResponse.<List<AccountResponse>>builder()
                .message("GET ALL TẤT CẢ TÀI KHOAN ADMIN THÀNH CÔNG")
                .result(accountService.getAllAdmin())
                .build();
    }

    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @PostMapping("/create-account-staff")
    ApiResponse<SignupResponse> createAccountSatff(@RequestBody @Valid SignupRequest signupRequest, JwtAuthenticationToken jwtAuthenticationToken) throws MessagingException, JOSEException{
        return ApiResponse.<SignupResponse>builder()
                .message("Tạo thành công account Staff")
                .result(accountService.createAccountStaff(signupRequest, jwtAuthenticationToken))
                .build();
    }

    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @PostMapping("/create-account-kitchen")
    ApiResponse<SignupResponse> createAccountKitchen(@RequestBody @Valid SignupRequest signupRequest, JwtAuthenticationToken jwtAuthenticationToken) throws MessagingException, JOSEException{
        return ApiResponse.<SignupResponse>builder()
                .message("Tạo thành công account kitchen staff")
                .result(accountService.createAccountKitchen(signupRequest,jwtAuthenticationToken))
                .build();
    }

    @GetMapping("/tenant/get-all-staff-kitchen")
    ApiResponse<List<AccountResponse>> getAllStaffAndKitchenByTenant(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Get all tài khoan nhân viên và đầu bếp thanh cong trong TENANT")
                .result(accountService.getAllStaffAndKitchenByTenant(jwtAuthenticationToken))
                .build();
    }

    @GetMapping("/tenant/get-all-staff")
    ApiResponse<List<AccountResponse>> getAllStaffByTenant(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Get all tài khoan nhan vien thanh cong trong TENANT")
                .result(accountService.getAllStaffByTenant(jwtAuthenticationToken))
                .build();
    }

    @GetMapping("/tenant/get-all-kitchen")
    ApiResponse<List<AccountResponse>> getAllKitchenByTenant(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<List<AccountResponse>>builder()
                .message("Get all tài khoan đầu bếp thanh cong trong TENANT")
                .result(accountService.getAllKitchenByTenant(jwtAuthenticationToken))
                .build();
    }

    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @PutMapping("/update-account/{accountId}")
    ApiResponse<AccountResponse> updateAccount(
            @PathVariable Integer accountId,
            @RequestBody @Valid AccountUpdateRequest updateRequest,
            JwtAuthenticationToken jwtAuthenticationToken) {
        return ApiResponse.<AccountResponse>builder()
                .message("Cập nhật thành công account")
                .result(accountService.updateAccount(accountId, updateRequest, jwtAuthenticationToken))
                .build();
    }

    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @PatchMapping("/update-active-account/{accountId}")
    ApiResponse<AccountResponse> updateActiveAccount(
            @PathVariable Integer accountId,
            @RequestBody @Valid AccountUpdateIsActiveRequest updateRequest,
            JwtAuthenticationToken jwtAuthenticationToken) {
        return ApiResponse.<AccountResponse>builder()
                .message("Cập nhật thành công active account")
                .result(accountService.updateActiveAccount(accountId, updateRequest, jwtAuthenticationToken))
                .build();
    }

    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @DeleteMapping("/delete-account/{accountId}")
    ApiResponse<String> deleteAccount(
            @PathVariable Integer accountId,
            JwtAuthenticationToken jwtAuthenticationToken) {
        accountService.deleteAccount(accountId, jwtAuthenticationToken);
        return ApiResponse.<String>builder()
                .message("Xóa thành công account")
                .result("Account đã được xóa")
                .build();
    }


}
