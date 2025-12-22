package com.smart_restaurant.demo.Service;


import com.nimbusds.jose.JOSEException;
import com.smart_restaurant.demo.dto.Request.AccountUpdateRequest;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.AccountResponse;
import com.smart_restaurant.demo.dto.Response.ConfirmEmailResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.ParseException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface AccountService {
    public Integer getTenantIdByUsername(String username);

    SignupResponse createAccount(SignupRequest signupRequest) throws JOSEException, MessagingException;
    ConfirmEmailResponse verifyEmail(String token) throws ParseException, java.text.ParseException, JOSEException;
    SignupResponse createAccountAdmin(SignupRequest signupRequest) throws JOSEException, MessagingException;
    SignupResponse createAccountStaff(SignupRequest signupRequest, JwtAuthenticationToken jwtAuthenticationToken) throws JOSEException, MessagingException;
    SignupResponse createAccountKitchen(SignupRequest signupRequest, JwtAuthenticationToken jwtAuthenticationToken) throws JOSEException, MessagingException;
    List<AccountResponse> getAllAdmin();
    List<AccountResponse> getAllStaffAndKitchenByTenant(JwtAuthenticationToken jwtAuthenticationToken);
    AccountResponse updateAccount(Integer accountId, AccountUpdateRequest updateRequest, JwtAuthenticationToken jwtAuthenticationToken);
    void deleteAccount(Integer accountId, JwtAuthenticationToken jwtAuthenticationToken);
}
