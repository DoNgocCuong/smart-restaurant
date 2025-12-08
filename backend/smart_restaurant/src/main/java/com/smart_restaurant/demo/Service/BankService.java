package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.SignupRequest;
import com.smart_restaurant.demo.dto.Request.TenantRequest;
import com.smart_restaurant.demo.entity.Bank;
import com.smart_restaurant.demo.entity.Tenant;

public interface BankService {
    Bank createBank(TenantRequest tenantRequest, Tenant tenant);
}
