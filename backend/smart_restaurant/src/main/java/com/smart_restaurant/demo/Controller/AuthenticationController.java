package com.smart_restaurant.demo.Controller;

import com.nimbusds.jose.JOSEException;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.AuthenticationService;
import com.smart_restaurant.demo.dto.Request.AuthenticateRequest;
import com.smart_restaurant.demo.dto.Request.GoogleLoginRequest;
import com.smart_restaurant.demo.dto.Request.SignupCustomerRequest;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.AuthenticationResponse;
import com.smart_restaurant.demo.dto.Response.ConfirmEmailResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@RequestMapping("api/auth")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    AccountService accountService;
    @PostMapping("/log-in")
    ApiResponse<AuthenticationResponse> authenticated (@RequestBody @Valid AuthenticateRequest authenticateRequest, HttpServletResponse response){
        AuthenticationResponse result=authenticationService.authenticate(authenticateRequest,response);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    @PostMapping("/log-out")
    ApiResponse<String>logout(HttpServletRequest request,HttpServletResponse response){
        return ApiResponse.<String>builder()
                .result("You have sucessfully logged out")
                .build();
    }
    @PostMapping("/refresh-token")
    ApiResponse<AuthenticationResponse> refreshToken(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.refreshToken(request,response))
                .build();
    }
    @PostMapping("/signup/{tenantId}")
    ApiResponse<SignupResponse> signup(@RequestBody @Valid SignupCustomerRequest request, @PathVariable Integer tenantId) throws MessagingException, JOSEException {
        return ApiResponse.<SignupResponse>builder()
                .message("sign up successfully")
                .result(accountService.createAccountCustomer(request,tenantId))
                .build();
    }
    @GetMapping("/verify-email")
    ApiResponse<ConfirmEmailResponse> verifyEmail(@RequestParam String token,HttpServletResponse httpServletResponse) throws jakarta.mail.internet.ParseException, ParseException, JOSEException, IOException {
        return ApiResponse.<ConfirmEmailResponse>builder()
                .message("verify email finish")
                .result(accountService.verifyEmail(token,httpServletResponse))
                .build();
    }

    @PostMapping("/log-in/email/{tenantId}")
    ApiResponse<AuthenticationResponse> authenticatedEmail (@RequestBody GoogleLoginRequest googleLoginRequest ,@PathVariable Integer tenantId,HttpServletResponse response){
        AuthenticationResponse result=authenticationService.loginWithGoogle(googleLoginRequest.getToken(),tenantId, response);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

}