package com.smart_restaurant.demo.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.smart_restaurant.demo.dto.Request.AuthenticateRequest;
import com.smart_restaurant.demo.dto.Request.IntrospectRequest;
import com.smart_restaurant.demo.dto.Response.AuthenticationResponse;
import com.smart_restaurant.demo.dto.Response.IntrospectResponse;
import com.smart_restaurant.demo.entity.Account;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticateRequest authenticateRequest, HttpServletResponse response);
    IntrospectResponse introspect(IntrospectRequest introspectRequest);
    SignedJWT verifyToken(String token,boolean isRefresh) throws JOSEException, ParseException;
    void logout(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException;
    AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response) throws ParseException, JOSEException;
    String generalToken(Account account);
}

