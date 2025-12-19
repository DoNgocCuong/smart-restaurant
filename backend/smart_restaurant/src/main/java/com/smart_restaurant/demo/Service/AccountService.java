package com.smart_restaurant.demo.Service;


import com.nimbusds.jose.JOSEException;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.ConfirmEmailResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.ParseException;

public interface AccountService {
    public Integer getTenantIdByUsername(String username);

    SignupResponse createAccount(SignupRequest signupRequest) throws JOSEException, MessagingException;
    ConfirmEmailResponse verifyEmail(String token) throws ParseException, java.text.ParseException, JOSEException;
    SignupResponse createAccountAdmin(SignupRequest signupRequest) throws JOSEException, MessagingException;
    SignupResponse createAccountStaff(SignupRequest signupRequest) throws JOSEException, MessagingException;
    SignupResponse createAccountKitchen(SignupRequest signupRequest) throws JOSEException, MessagingException;
}
