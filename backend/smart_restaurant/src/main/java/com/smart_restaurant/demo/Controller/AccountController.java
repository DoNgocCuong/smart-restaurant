package com.smart_restaurant.demo.Controller;

import com.nimbusds.jose.JOSEException;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @PostMapping("/create-account-staff")
    ApiResponse<SignupResponse> createAccountSatff(@RequestBody @Valid SignupRequest signupRequest) throws MessagingException, JOSEException{
        return ApiResponse.<SignupResponse>builder()
                .message("Tạo thành công account Staff")
                .result(accountService.createAccountStaff(signupRequest))
                .build();
    }

    @PreAuthorize("hasRole('TENANT_ADMIN')")
    @PostMapping("/create-account-kitchen")
    ApiResponse<SignupResponse> createAccountKitchen(@RequestBody @Valid SignupRequest signupRequest) throws MessagingException, JOSEException{
        return ApiResponse.<SignupResponse>builder()
                .message("Tạo thành công account kitchen staff")
                .result(accountService.createAccountKitchen(signupRequest))
                .build();
    }


}
