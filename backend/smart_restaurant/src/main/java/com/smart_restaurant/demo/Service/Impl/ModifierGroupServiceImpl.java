package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.ModifierGroupRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.ModifierGroupService;
import com.smart_restaurant.demo.dto.Request.ModifierGroupRequest;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.entity.ModifierGroup;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ModifierGroupMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ModifierGroupServiceImpl implements ModifierGroupService {

    AccountService accountService;
    ModifierGroupRepository modifierGroupRepository;
    ModifierGroupMapper modifierGroupMapper;
    TenantRepository tenantRepository;

    @Override
    public ModifierGroupResponse createModifierGroup(ModifierGroupRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        // Kiêm tra tên này đã có chưa vs tenant này
        boolean existsModifierGroup = modifierGroupRepository.existsByNameAndTenantTenantId(request.getName(), tenantId);
        if(existsModifierGroup){
            throw new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND);
        }


        // Chuyen sang entity
        ModifierGroup modifierGroup = modifierGroupMapper.toModifierGroup(request);
        modifierGroup.setTenant(tenant);
        modifierGroup.setOptions(new ArrayList<>());
        modifierGroup.setItems(new ArrayList<>());

        ModifierGroup saveModifierGroup = modifierGroupRepository.save(modifierGroup);
        ModifierGroupResponse modifierGroupResponse = modifierGroupMapper.toModifierGroupResponse(saveModifierGroup);
        modifierGroupResponse.setItems(saveModifierGroup.getItems());
        modifierGroupResponse.setOptions(saveModifierGroup.getOptions());
        modifierGroupResponse.setTenantId(saveModifierGroup.getTenant().getTenantId());


        return modifierGroupResponse;
    }

    @Override
    public List<ModifierGroupResponse> getAllModifierGroup(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        List<ModifierGroup> modifierGroup = modifierGroupRepository.findAllByTenant_TenantId(tenantId);

        List<ModifierGroupResponse> responses = modifierGroup.stream()
                .map(group -> {
                    ModifierGroupResponse response = modifierGroupMapper.toModifierGroupResponse(group);
                    response.setItems(group.getItems());
                    response.setOptions(group.getOptions());
                    response.setTenantId(group.getTenant().getTenantId());

                    return response;
                }).collect(Collectors.toList());

        return responses;






    }
}
