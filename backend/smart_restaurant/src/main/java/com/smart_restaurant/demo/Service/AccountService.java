package com.smart_restaurant.demo.Service;


import com.nimbusds.jose.JOSEException;
import com.smart_restaurant.demo.dto.Request.*;
import com.smart_restaurant.demo.dto.Response.AccountResponse;
import com.smart_restaurant.demo.dto.Response.ConfirmEmailResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.ParseException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.io.IOException;
import java.util.List;

public interface AccountService {
    public Integer getTenantIdByUsername(String username);

    SignupResponse createAccountCustomer(SignupCustomerRequest signupRequest, Integer tenantId) throws JOSEException, MessagingException;
    ConfirmEmailResponse verifyEmail(String token, HttpServletResponse response) throws ParseException, java.text.ParseException, JOSEException, IOException;
    SignupResponse createAccountAdmin(SignupRequest signupRequest) throws JOSEException, MessagingException;
    SignupResponse createAccountStaff(SignupStaffRequest signupStaffRequest, JwtAuthenticationToken jwtAuthenticationToken) throws JOSEException, MessagingException;
    SignupResponse createAccountKitchen(SignupKitchenRequest signupKitchenRequest, JwtAuthenticationToken jwtAuthenticationToken) throws JOSEException, MessagingException;
    List<AccountResponse> getAllStaffByTenant(JwtAuthenticationToken jwtAuthenticationToken);
    List<AccountResponse> getAllKitchenByTenant(JwtAuthenticationToken jwtAuthenticationToken);
    List<AccountResponse> getAllAdmin();
    List<AccountResponse> getAllStaffAndKitchenByTenant(JwtAuthenticationToken jwtAuthenticationToken);
    AccountResponse updateAccount(Integer accountId, AccountUpdateRequest updateRequest, JwtAuthenticationToken jwtAuthenticationToken);
    AccountResponse updateActiveAccount(Integer accountId, AccountUpdateIsActiveRequest updateRequest, JwtAuthenticationToken jwtAuthenticationToken);
    void deleteAccount(Integer accountId, JwtAuthenticationToken jwtAuthenticationToken);
    String deleteAccountAdminTenant(Integer accountId);
    AccountResponse updateAccountAdminTenant(Integer accountId,AccountUpdateRequest updateRequest);
    AccountResponse updateActiveAccountAdminTenant( Integer accountId, AccountUpdateIsActiveRequest updateRequest);
}
