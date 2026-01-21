package com.smart_restaurant.demo.Service.Impl;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.InvalidatedTokenRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.AuthenticationService;
import com.smart_restaurant.demo.dto.Request.AuthenticateRequest;
import com.smart_restaurant.demo.dto.Request.IntrospectRequest;
import com.smart_restaurant.demo.dto.Request.SignupCustomerRequest;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.AuthenticationResponse;
import com.smart_restaurant.demo.dto.Response.IntrospectResponse;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.InvalidatedToken;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationServiceImpl.class);
    AccountRepository accountRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    @NonFinal
    @Value("${jwt.secret}")
    protected String key;
    @NonFinal
    @Value("${jwt.access-token-validity-seconds}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refresh-token-validity-seconds}")
    protected long REFRESHABLE_DURATION;
    @NonFinal
    @Value("${google.client-id}")
    private String googleClientId;
     AccountServiceImpl accountService;

    @Override
    public AuthenticationResponse authenticate(AuthenticateRequest authenticateRequest, HttpServletResponse response) {
         Account account=accountRepository.findByUsername(authenticateRequest.getUserName())
                .orElseThrow(() ->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
         if(!account.getIsEmailVerify())
             throw new AppException(ErrorCode.EMAIL_NOT_VERIFY);


        PasswordEncoder passwordEncoder= new BCryptPasswordEncoder(10);
        boolean authenticated=passwordEncoder.matches(authenticateRequest.getPassword(),account.getPassword());
        log.warn("Raw pw = " + authenticateRequest.getPassword());
        log.warn("Hash pw = " + account.getPassword());
        log.warn("Matched = " + authenticated);


        if(!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        String accessToken=generalToken(account);
        String refreshToken=generateRefreshToken(account);
        setRefreshCookie(response,refreshToken);
        AuthenticationResponse authenticationResponse= AuthenticationResponse.builder()
                .isFirstActivity(account.getIsFirstActivity())
                .acessToken(accessToken)
                .build();
        account.setIsFirstActivity(false);
        return  authenticationResponse;
    }
    private void setRefreshCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) REFRESHABLE_DURATION);
        response.addCookie(cookie);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("refresh_token")) {
                return cookie.getValue();
            }
        }
        return null;
    }
    @Override
    public String generalToken(Account account) {

        JWSHeader header= new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet=new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("cuong.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope",buildScope(account))
                .build();
        Payload payload=new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject= new JWSObject(header,payload);
        try{
            jwsObject.sign(new MACSigner(key.getBytes()));
            return jwsObject.serialize();
        }catch (JOSEException e){
            throw new RuntimeException(e);
        }
    }
    public String generateRefreshToken(Account account) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("cuong.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("type", "refresh")
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(account.getRoles())) {
            account.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
                }
            });
        }
        System.out.println("Scope = " +account);
        return stringJoiner.toString();
    }
    @SneakyThrows
    @Override
    public IntrospectResponse introspect(IntrospectRequest introspectRequest) {
        String token=introspectRequest.getToken();
        boolean isValid=true;
        try{
            verifyToken(token,false);
        }catch(AppException e){
            isValid=false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();

    }

    @Override
    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier=new MACVerifier(key.getBytes());

        SignedJWT signedJWT= SignedJWT.parse(token);
        if(isRefresh){
            String type = signedJWT.getJWTClaimsSet().getStringClaim("type");
            if (!"refresh".equals(type))
                throw new AppException(ErrorCode.UNAUTHENTICATED);

        }
        var verify=signedJWT.verify(jwsVerifier);

        Date expiryTime= signedJWT.getJWTClaimsSet().getExpirationTime();

        if (!(verify&&expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    @Override
    public void logout(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException {
        try{
            String refreshToken=extractRefreshToken(request);
            SignedJWT signedJWT=verifyToken(refreshToken,true);
            String jit=signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime=signedJWT.getJWTClaimsSet().getExpirationTime();
            InvalidatedToken invalidatedToken=InvalidatedToken.builder().id(jit).expireTime(expiryTime).build();
            invalidatedTokenRepository.save(invalidatedToken);
            clearRefreshCookie(response);
        }catch(AppException e){
            log.info("Token already expire");
        }
    }

    @Override
    public AuthenticationResponse refreshToken(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException {
        String refreshToken=extractRefreshToken(request);
        if (refreshToken == null)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        SignedJWT signedJWT=verifyToken(refreshToken,true);

        String jit=signedJWT.getJWTClaimsSet().getJWTID().toString();
        Date expiryTime=signedJWT.getJWTClaimsSet().getExpirationTime();
        String nameUser=signedJWT.getJWTClaimsSet().getSubject();
        Account account=accountRepository.findByUsername(nameUser).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        InvalidatedToken invalidatedToken=InvalidatedToken.builder()
                .id(jit)
                .expireTime(expiryTime)
                .token(refreshToken)
                .account(account)
                .build();
        invalidatedTokenRepository.save(invalidatedToken);


        String newAccessToken=generalToken(account);
        String newRefreshToken=generateRefreshToken(account);
        setRefreshCookie(response,newRefreshToken);

        return AuthenticationResponse.builder()
                .acessToken(newAccessToken)
                .build();

    }






    private GoogleIdToken.Payload verifyGoogleToken(String token) {
        try {
            NetHttpTransport transport = new NetHttpTransport();
            JsonFactory jsonFactory = GsonFactory.getDefaultInstance();

            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                            // .setAudience(Collections.singletonList(googleClientId))
                            .setAudience(Collections.singletonList("955403983411-1bp707jbei53tthatuk0863enivvu5f3.apps.googleusercontent.com"))
                            .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken == null) {
                System.out.println("Token verification failed. Audience in token: " + token);
                throw new RuntimeException("Google token verification failed");
            }
            System.out.println("id token: " + idToken);


            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            return idToken.getPayload();

        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed", e);
        }
    }

    @Override
    public AuthenticationResponse loginWithGoogle(String googleToken,Integer tenantId,HttpServletResponse response) {

        // 1. verify token google
        GoogleIdToken.Payload payload = verifyGoogleToken(googleToken);

        // 2. lấy thông tin user
        String email = payload.getEmail();
        String name  = (String) payload.get("name");

        // 3. tìm hoặc tạo user
        Account account = accountRepository.findByUsername(email)
                .orElseGet(() -> {
                    try {
                        return createAccount(email, tenantId);
                    } catch (MessagingException e) {
                        throw new RuntimeException(e);
                    } catch (JOSEException e) {
                        throw new RuntimeException(e);
                    }
                });

        // 4. generate JWT hệ thống
        String accessToken = generalToken(account);
        String refreshToken=generateRefreshToken(account);
        setRefreshCookie(response,refreshToken);
        AuthenticationResponse authenticationResponse= AuthenticationResponse.builder()
                .acessToken(accessToken)
                .isFirstActivity(account.getIsFirstActivity())
                .build();

        return authenticationResponse;
    }
    Account createAccount(String email,Integer tenantId) throws MessagingException, JOSEException {
        SignupCustomerRequest signupRequest=SignupCustomerRequest.builder().username(email).password("admin123").build();
        accountService.createAccountCustomer(signupRequest,tenantId);
        Account account=accountRepository.findByUsername(email).orElseThrow(()-> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        account.setIsEmailVerify(true);
        return  accountRepository.save(account);
    }
}





