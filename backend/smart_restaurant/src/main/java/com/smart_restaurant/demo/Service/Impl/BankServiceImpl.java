package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.BankRepository;
import com.smart_restaurant.demo.Service.BankService;
import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.entity.Bank;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.mapper.BankMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BankServiceImpl implements BankService {
    BankMapper bankMapper;
    BankRepository bankRepository;
    @Override
    public Bank createBank(TenantRequest tenantRequest, Tenant tenant) {
        Bank bank=bankRepository.findByTenant_TenantId(tenant.getTenantId());
        if(!(bank==null)){
            bank.setBankNumber(tenantRequest.getBankNumber());
            bank.setNameBank(tenantRequest.getNameBank());
            bank.setBankAccountHolderName(tenantRequest.getBankAccountHolderName());
        }
        Bank newBank=bankMapper.toBank(tenantRequest);
        newBank.setTenant(tenant);
        return bankRepository.save(newBank);
    }
}
