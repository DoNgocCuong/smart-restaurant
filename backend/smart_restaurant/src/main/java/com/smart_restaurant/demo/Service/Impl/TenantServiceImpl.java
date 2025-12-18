package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.BankRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.BankService;
import com.smart_restaurant.demo.Service.TenantService;
import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTenantRequest;
import com.smart_restaurant.demo.dto.Response.TenantResponse;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.Bank;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.TenantMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TenantServiceImpl implements TenantService {
    AccountRepository accountRepository;
    TenantMapper tenantMapper;
    TenantRepository tenantRepository;
    BankService bankService;
    BankRepository bankRepository;
    @Override
    public TenantResponse createTenant(TenantRequest tenantRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        Account account=accountRepository.findByUsername(jwtAuthenticationToken.getName()).get();
        if(!(account.getTenant()==null))
            throw new AppException(ErrorCode.TENANT_EXISTED);
        if(account.getIsEmailVerify()==false)
            throw new AppException(ErrorCode.NOT_VERIFY_EMAIL);
        System.out.println("Phone mapped: " + tenantRequest.getPhone());
        System.out.println("Phone mapped: " + tenantMapper.toTenant(tenantRequest).getNameTenant());
        Tenant newTenant= tenantRepository.save(tenantMapper.toTenant(tenantRequest));

        account.setTenant(newTenant);
        accountRepository.save(account);
        bankService.createBank(tenantRequest,newTenant);
        return tenantMapper.toTenantResponse(newTenant);
    }

    @Override
    public Tenant tenantId(JwtAuthenticationToken jwtAuthenticationToken) {
        Account account=accountRepository.findByUsername(jwtAuthenticationToken.getName()).get();
        if(account==null)
            throw new AppException(ErrorCode.ACCOUNT_NOT_EXITS);
        return account.getTenant();
    }
    public TenantResponse updateTenant(Integer tenantId, UpdateTenantRequest updateTenantRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        Account account=accountRepository.findByUsername(jwtAuthenticationToken.getName()).get();
        if((account.getTenant()==null))
            throw new AppException(ErrorCode.TENANT_NOT_FOUND);

        Tenant tenant = account.getTenant();

        if (!tenant.getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.FOBIDEN); // không cho update tenant khác
        }

        tenantMapper.updateTenant(tenant, updateTenantRequest);
        // Cập nhật bank
        Bank bank = bankRepository.findByTenant_TenantId(tenant.getTenantId());
        if (bank == null) {
            bank = new Bank();
            bank.setTenant(tenant);
        }

        if (updateTenantRequest.getNameBank() != null) bank.setNameBank(updateTenantRequest.getNameBank());
        if (updateTenantRequest.getBankNumber() != null) bank.setBankNumber(updateTenantRequest.getBankNumber());
        if (updateTenantRequest.getBankAccountHolderName() != null) bank.setBankAccountHolderName(updateTenantRequest.getBankAccountHolderName());
        bankRepository.save(bank);

        Tenant updatedTenant = tenantRepository.save(tenant);

        return tenantMapper.toTenantResponse((updatedTenant));
    }

    @Override
    public TenantResponse getMyProfileTenant(JwtAuthenticationToken jwtAuthenticationToken) {
        Account account=accountRepository.findByUsername(jwtAuthenticationToken.getName()).get();
        if((account.getTenant()==null))
            throw new AppException(ErrorCode.TENANT_NOT_FOUND);

        Tenant tenant = account.getTenant();
        TenantResponse tenantResponse = tenantMapper.toTenantResponse(tenant);

        return tenantResponse;
    }


}
