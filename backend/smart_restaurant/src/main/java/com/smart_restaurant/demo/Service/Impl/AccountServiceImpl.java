package com.smart_restaurant.demo.Service.Impl;


import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.dto.Request.*;
import com.smart_restaurant.demo.dto.Response.AccountResponse;
import com.smart_restaurant.demo.entity.*;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.dto.Response.ConfirmEmailResponse;
import com.smart_restaurant.demo.dto.Response.SignupResponse;
import com.smart_restaurant.demo.enums.Roles;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.AccountMapper;
import com.smart_restaurant.demo.mapper.CustomerMapper;
import com.smart_restaurant.demo.mapper.EmployeeMapper;
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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    TenantRepository tenantRepository;
    CustomerMapper customerMapper;
    CustomerRepository customerRepository;
    EmployeeMapper employeeMapper;
    EmployeeRepository employeeRepository;
    TableRepository tableRepository;


    @Override
    public SignupResponse createAccountCustomer(SignupCustomerRequest signupRequest, Integer tenantId) throws JOSEException {
        Tenant tenant= tenantRepository.findById(tenantId).orElseThrow(()->new AppException(ErrorCode.TENANT_NOT_FOUND));

        if(accountRepository.existsByUsernameAndTenant_TenantId(signupRequest.getUsername(),tenantId))
            throw new AppException(ErrorCode.ACCOUNT_EXISTED);
        Account newAccount=accountMapper.toAccount(signupRequest);
        String password= passwordEncoder.encode(signupRequest.getPassword());
        newAccount.setPassword(password);
        newAccount.setRoles(roleRepository.findAllByName(Roles.CUSTOMER.toString()));
        newAccount.setIsCustomer(true);
        newAccount.setIsFirstActivity(true);
        newAccount.setIsEmailVerify(false);
        newAccount.setTenant(tenant);
        newAccount.setIsActive(true);
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

    @Override
    public SignupResponse createAccountAdmin(SignupRequest signupRequest) throws JOSEException, MessagingException {
        if(accountRepository.existsByUsername(signupRequest.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);
        Account newAccount=accountMapper.toAccount(signupRequest);
        String password= passwordEncoder.encode(signupRequest.getPassword());
        newAccount.setPassword(password);
        newAccount.setRoles(roleRepository.findAllByName(Roles.TENANT_ADMIN.toString()));
        newAccount.setIsEmailVerify(true);
        newAccount.setIsActive(true);
        String token=generateEmailToken(newAccount);
        return accountMapper.toSignupResponse(accountRepository.save(newAccount));
    }

    @Override
    public SignupResponse createAccountStaff(SignupStaffRequest signupStaffRequest, JwtAuthenticationToken jwtAuthenticationToken) throws JOSEException, MessagingException {

        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        if (accountRepository.existsByUsernameAndTenant_TenantId(
                signupStaffRequest.getUsername(), tenantId)) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }


        Account newAccount=accountMapper.toAccountStaff(signupStaffRequest);
        String password= passwordEncoder.encode(signupStaffRequest.getPassword());
        newAccount.setPassword(password);
        newAccount.setRoles(roleRepository.findAllByName(Roles.STAFF.toString()));
        newAccount.setIsEmailVerify(true);
        newAccount.setIsActive(true);
        newAccount.setIsFirstActivity(true);
        newAccount.setTenant(tenant);

        Employee employee = employeeMapper.toEmployee(signupStaffRequest);
        employee.setIsEmployee(true);
        if (signupStaffRequest.getRestaurantTableId() != null && !signupStaffRequest.getRestaurantTableId().isEmpty()) {
            List<RestaurantTable> restaurantTables = tableRepository.findAllById(signupStaffRequest.getRestaurantTableId());

            // Validate: số lượng bàn truy vấn phải = số lượng ID gửi lên
            if (restaurantTables.size() != signupStaffRequest.getRestaurantTableId().size()) {
                throw new AppException(ErrorCode.TABLE_NOT_FOUND);
            }

            // Validate: tất cả bàn phải thuộc về cùng tenant
            boolean allBelongToTenant = restaurantTables.stream()
                    .allMatch(table -> table.getTenant().getTenantId().equals(tenantId));

            if (!allBelongToTenant) {
                throw new AppException(ErrorCode.TABLE_NOT_BELONGS_TO_TENANT);
            }


            employee.setRestaurantTables(restaurantTables);

        }

        Account account=accountRepository.save(newAccount);
        employee.setAccount(account);
        employeeRepository.save(employee);
        return accountMapper.toSignupResponse(account);
    }

    @Override
    public SignupResponse createAccountKitchen(SignupKitchenRequest signupKitchenRequest, JwtAuthenticationToken jwtAuthenticationToken) throws JOSEException, MessagingException {


        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        if (accountRepository.existsByUsernameAndTenant_TenantId(
                signupKitchenRequest.getUsername(), tenantId)) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }


        Account newAccount=accountMapper.toAccountKitchen(signupKitchenRequest);
        String password= passwordEncoder.encode(signupKitchenRequest.getPassword());
        newAccount.setPassword(password);
        newAccount.setRoles(roleRepository.findAllByName(Roles.KITCHEN_STAFF.toString()));
        newAccount.setIsEmailVerify(true);
        newAccount.setIsActive(true);
        newAccount.setIsFirstActivity(true);
        newAccount.setTenant(tenant);

        Employee employee = employeeMapper.toEmployeeKitchen(signupKitchenRequest);
        employee.setIsEmployee(false);
        employee.setRestaurantTables(null);
        Account account=accountRepository.save(newAccount);
        employee.setAccount(account);
        employeeRepository.save(employee);
        return accountMapper.toSignupResponse(account);
    }

    @Override
    public List<AccountResponse> getAllStaffByTenant(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        return accountRepository.findAll().stream()
                .filter(account -> account.getTenant() != null
                        && account.getTenant().getTenantId().equals(tenantId)
                        && account.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("STAFF")))
                .map(account -> {
                    var dto = accountMapper.toAccountResponse(account);
                    dto.setTenant(account.getTenant());
                    dto.setRoles(account.getRoles());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<AccountResponse> getAllKitchenByTenant(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        return accountRepository.findAll().stream()
                .filter(account -> account.getTenant() != null
                        && account.getTenant().getTenantId().equals(tenantId)
                        && account.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("KITCHEN_STAFF")))
                .map(account -> {
                    var dto = accountMapper.toAccountResponse(account);
                    dto.setTenant(account.getTenant());
                    dto.setRoles(account.getRoles());
                    return dto;
                })
                .toList();
    }

    @Override
    public List<AccountResponse> getAllAdmin() {
        var admins = accountRepository.findAll().stream()
                .filter(account -> account.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("TENANT_ADMIN")))
                .toList();

        var adminDTOs = admins.stream()
                .map(admin -> {
                    var dto = accountMapper.toAccountResponse(admin);
                    dto.setTenant(admin.getTenant());
                    dto.setRoles(admin.getRoles());
                    return dto;
                })
                .toList();

        return adminDTOs;
    }
    @Override
    public List<AccountResponse> getAllStaffAndKitchenByTenant(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        return accountRepository.findAll().stream()
                .filter(account -> account.getTenant() != null
                        && account.getTenant().getTenantId().equals(tenantId)
                        && account.getRoles().stream()
                        .anyMatch(role -> role.getName().equals("STAFF")
                                || role.getName().equals("KITCHEN_STAFF")))
                .map(account -> {
                    var dto = accountMapper.toAccountResponse(account);
                    dto.setTenant(account.getTenant());
                    dto.setRoles(account.getRoles());
                    return dto;
                })
                .toList();
    }
    @Override
    public AccountResponse updateAccount(Integer accountId, AccountUpdateRequest updateRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        // Kiểm tra account tồn tại
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Kiểm tra account có thuộc tenant hiện tại không
        if(!account.getTenant().getTenantId().equals(tenantId))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        // Kiểm tra account là staff hoặc kitchen staff
        boolean isStaffOrKitchen = account.getRoles().stream()
                .anyMatch(role -> role.getName().equals(Roles.STAFF.toString())
                        || role.getName().equals(Roles.KITCHEN_STAFF.toString()));

        if(!isStaffOrKitchen)
            throw new AppException(ErrorCode.INVALID_ROLE);

        // Cập nhật thông tin
        if(updateRequest.getUserName() != null && !updateRequest.getUserName().isEmpty())
            account.setUsername(updateRequest.getUserName());
        // Cập nhật password nếu có
        if(updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty())
            account.setPassword(passwordEncoder.encode(updateRequest.getPassword()));

        Account updatedAccount = accountRepository.save(account);
        return accountMapper.toAccountResponse(updatedAccount);
    }

    @Override
    public AccountResponse updateActiveAccount(Integer accountId, AccountUpdateIsActiveRequest updateRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        // Kiểm tra account tồn tại
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Kiểm tra account có thuộc tenant hiện tại không
        if(!account.getTenant().getTenantId().equals(tenantId))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        // Kiểm tra account là staff hoặc kitchen staff
        boolean isStaffOrKitchen = account.getRoles().stream()
                .anyMatch(role -> role.getName().equals(Roles.STAFF.toString())
                        || role.getName().equals(Roles.KITCHEN_STAFF.toString()));

        if(!isStaffOrKitchen)
            throw new AppException(ErrorCode.INVALID_ROLE);

        // Cập nhật thông tin
        if (updateRequest.getIsActive() != null) {
            account.setIsActive(updateRequest.getIsActive());
        }

        Account updatedAccount = accountRepository.save(account);
        return accountMapper.toAccountResponse(updatedAccount);
    }

    @Override
    public void deleteAccount(Integer accountId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = this.getTenantIdByUsername(username);

        // Kiểm tra account tồn tại
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Kiểm tra account có thuộc tenant hiện tại không
        if(!account.getTenant().getTenantId().equals(tenantId))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        // Kiểm tra account là staff hoặc kitchen staff
        boolean isStaffOrKitchen = account.getRoles().stream()
                .anyMatch(role -> role.getName().equals(Roles.STAFF.toString())
                        || role.getName().equals(Roles.KITCHEN_STAFF.toString()));

        if(!isStaffOrKitchen)
            throw new AppException(ErrorCode.INVALID_ROLE);

        // Xóa account
        accountRepository.deleteById(accountId);
    }


    private void sendQrEmail(String toEmail, String token) throws MessagingException {
        String localIp = System.getenv("LOCAL_IP");
        String port = System.getenv("PORT");
        // Giá trị fallback trong trường hợp biến không tồn tại
        if (localIp == null || localIp.isEmpty()) {
            localIp = "localhost";
        }
        if (port == null || port.isEmpty()) {
            port = "8080";
        }
        String confirmUrl = "http://" + localIp + ":" + port + "/api/auth/verify-email?token=" + token;

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

    @Override
    public String deleteAccountAdminTenant(Integer accountId) {
        Account account= accountRepository.findById(accountId).orElseThrow(()-> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        account.setIsActive(false);
        accountRepository.save(account);
        return "delete account admin successfully";
    }

    @Override
    public AccountResponse updateAccountAdminTenant(Integer accountId, AccountUpdateRequest updateRequest) {
        Account account= accountRepository.findById(accountId).orElseThrow(()-> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        if(accountRepository.existsByUsernameAndTenant_TenantId(updateRequest.getUserName(),account.getTenant().getTenantId())==true){
            throw  new AppException(ErrorCode.ACCOUNT_EXISTED);
        }
        account.setUsername(updateRequest.getUserName());
        account.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        return accountMapper.toAccountResponse(accountRepository.save(account));
    }

    @Override
    public AccountResponse updateActiveAccountAdminTenant(Integer accountId, AccountUpdateIsActiveRequest updateRequest) {
        Account account= accountRepository.findById(accountId).orElseThrow(()-> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        account.setIsActive(updateRequest.getIsActive());
        return accountMapper.toAccountResponse(accountRepository.save(account));
    }
}
