package com.smart_restaurant.demo.Service.Impl;


import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.RoleRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Response.ConfirmEmailResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.Role;
import com.smart_restaurant.demo.enums.Roles;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.AccountMapper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.ParseException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountServiceImpl implements AccountService {
    @NonFinal
    @Value("${jwt.EMAIL_KEY}")
    protected String EMAIL_SECRET;
    @NonFinal
    @Value("${jwt.email-token-validity-seconds}")
    protected long VALID_DURATION;
    AccountMapper accountMapper;
    AccountRepository accountRepository;
    JavaMailSender mailSender;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    @Override
    public SignupResponse createAccount(SignupRequest signupRequest) throws JOSEException {
        if(accountRepository.existsByUsername(signupRequest.getUsername()))
            throw new AppException(ErrorCode.ACCOUNT_EXISTED);
        Account newAccount=accountMapper.toAccount(signupRequest);
        String password= passwordEncoder.encode(signupRequest.getPassword());
        newAccount.setPassword(password);
        newAccount.setRoles(roleRepository.findAllByName(Roles.TENANT_ADMIN.toString()));
        String token=generateEmailToken(newAccount);
        try {
            sendQrEmail(newAccount.getUsername(),token);
        } catch (MessagingException e) {
            System.out.println("email loi ");
            throw new AppException(ErrorCode.JWT_ERROR);
        }
        return accountMapper.toSignupResponse(accountRepository.save(newAccount));
    }

    @Override
    public ConfirmEmailResponse verifyEmail(String token) throws ParseException, java.text.ParseException, JOSEException {
        boolean confirm=verifyEmailToken(token);
        SignedJWT signedJWT=SignedJWT.parse(token);
        Account account=accountRepository.findByUsername(signedJWT.getJWTClaimsSet().getSubject()).get();
        account.setIsEmailVerify(true);
        accountRepository.save(account);
        return ConfirmEmailResponse.builder()
                .confirm_email(true)
                .build();
    }

    private void sendQrEmail(String toEmail, String token) throws MessagingException {
        String confirmUrl = "http://localhost:8080/api/auth/verify-email?token=" + token;

        String htmlMsg = "<h3>Chào mừng bạn!</h3>"
                + "<p>Bạn vừa đăng ký web quản lý nhà hàng của mình.</p>"
                + "<p>Nếu là bạn, hãy nhấn nút bên dưới để xác nhận:</p>"
                + "<p>Nếu không phải thì có thể bỏ qua:</p>"
                + "<a href='" + confirmUrl + "' style='display:inline-block;padding:10px 20px;"
                + "color:white;background-color:#28a745;text-decoration:none;border-radius:5px;'>"
                + "Xác nhận</a>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        helper.setText(htmlMsg, true); // true = HTML
        helper.setTo(toEmail);
        helper.setSubject("Xác nhận đăng ký web quản lý nhà hàng");
        helper.setFrom("noreply@yourdomain.com");
        mailSender.send(message);
    }
    public String generateEmailToken(Account acc) throws JOSEException {

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(acc.getUsername().toString())
                .claim("type", "email")
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .build();

        JWSObject jws = new JWSObject(
                new JWSHeader(JWSAlgorithm.HS512),
                new Payload(claims.toJSONObject())
        );

        jws.sign(new MACSigner(EMAIL_SECRET.getBytes()));

        return jws.serialize();
    }
    public boolean verifyEmailToken(String token) throws JOSEException, ParseException, java.text.ParseException {
        SignedJWT jwt = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(EMAIL_SECRET.getBytes());

        if (!jwt.verify(verifier)) throw new AppException(ErrorCode.WRONG_TOKEN);
        if (!"email".equals(jwt.getJWTClaimsSet().getStringClaim("type"))) throw  new AppException(ErrorCode.WRONG_TYPE);

        if (jwt.getJWTClaimsSet().getExpirationTime().before(new Date()))
            throw new AppException(ErrorCode.OUT_OF_TIME);
        return true;
    }
    @Override
    public Integer getTenantIdByUsername(String username) {
        return accountRepository.findTenantIdByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));
    }
}
