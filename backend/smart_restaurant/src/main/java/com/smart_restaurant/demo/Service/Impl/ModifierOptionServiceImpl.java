package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.ModifierGroupRepository;
import com.smart_restaurant.demo.Repository.ModifierOptionRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.ModifierOptionService;
import com.smart_restaurant.demo.dto.Request.ModifierOptionRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierOptionIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierOptionRequest;
import com.smart_restaurant.demo.dto.Response.ModifierOptionResponse;
import com.smart_restaurant.demo.entity.ModifierGroup;
import com.smart_restaurant.demo.entity.ModifierOption;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ModifierOptionMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ModifierOptionServiceImpl implements ModifierOptionService {
    AccountService accountService;
    ModifierOptionRepository modifierOptionRepository;
    ModifierGroupRepository modifierGroupRepository;
    ModifierOptionMapper modifierOptionMapper;

    @Override
    public ModifierOptionResponse createModifierOption(ModifierOptionRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Lấy modifier group từ request
        ModifierGroup modifierGroup = modifierGroupRepository.findById(request.getModifierGroupId())
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND));

        // Kiểm tra xem modifier group này thuộc tenant của user không
        if (!modifierGroup.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Kiểm tra xem tên option này đã tồn tại trong group chưa
        boolean existsOption = modifierOptionRepository.existsByNameAndModifierGroup_ModifierGroupId(request.getName(), request.getModifierGroupId());
        if (existsOption) {
            throw new AppException(ErrorCode.MODIFIER_OPTION_ALREADY_EXISTS);
        }

        // Kiểm tra xem tên option này đã tồn tại trong group của tenant chưa
        modifierOptionRepository.findByNameAndModifierGroup_ModifierGroupIdAndModifierGroup_Tenant_TenantId(request.getName(), request.getModifierGroupId(), tenantId)
                .ifPresent(option -> {
                    throw new AppException(ErrorCode.MODIFIER_OPTION_ALREADY_EXISTS);
                });


        ModifierOption modifierOption = modifierOptionMapper.toModifierOption(request);
        modifierOption.setModifierGroup(modifierGroup);

        ModifierOption savedOption = modifierOptionRepository.save(modifierOption);
        ModifierOptionResponse modifierOptionResponse = modifierOptionMapper.toModifierOptionResponse(savedOption);
        modifierOptionResponse.setModifierGroupId(savedOption.getModifierOptionId());
        modifierOptionResponse.setModifierGroupName(savedOption.getModifierGroup().getName());
        return modifierOptionResponse;
    }

    @Override
    public List<ModifierOptionResponse> getAllModifierOption(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Lấy tất cả option của tenant
        List<ModifierOption> options = modifierOptionRepository.findAllByModifierGroup_Tenant_TenantId(tenantId);

        return options.stream()
                .map(option -> {
                    ModifierOptionResponse response = modifierOptionMapper.toModifierOptionResponse(option);
                    response.setModifierGroupId(option.getModifierGroup().getModifierGroupId());
                    response.setModifierGroupName(option.getModifierGroup().getName());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ModifierOptionResponse> getAllModifierOptionByModifierGroup(Integer modifierGroupId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Kiểm tra xem modifier group này tồn tại không
        ModifierGroup modifierGroup = modifierGroupRepository.findById(modifierGroupId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND));

        // Kiểm tra xem modifier group này thuộc tenant của user không
        if (!modifierGroup.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Lấy tất cả option của group
        List<ModifierOption> options = modifierOptionRepository.findAllByModifierGroup_ModifierGroupId(modifierGroupId);

        return options.stream()
                .map(option -> {
                    ModifierOptionResponse response = modifierOptionMapper.toModifierOptionResponse(option);
                    response.setModifierGroupId(option.getModifierGroup().getModifierGroupId());
                    response.setModifierGroupName(option.getModifierGroup().getName());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ModifierOptionResponse getModifierOptionDetail(Integer modifierOptionId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Kiểm tra xem option có thuộc tenant của user không
        ModifierOption modifierOption = modifierOptionRepository.findByModifierOptionIdAndModifierGroup_Tenant_TenantId(modifierOptionId, tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_OPTION_NOT_IN_TENANT));

        ModifierOptionResponse response = modifierOptionMapper.toModifierOptionResponse(modifierOption);
        response.setModifierGroupId(modifierOption.getModifierGroup().getModifierGroupId());
        response.setModifierGroupName(modifierOption.getModifierGroup().getName());
        return response;
    }

    @Override
    public ModifierOptionResponse updateModifierOption(Integer modifierOptionId, UpdateModifierOptionRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Kiểm tra xem option có thuộc tenant của user không
        ModifierOption modifierOption = modifierOptionRepository.findByModifierOptionIdAndModifierGroup_Tenant_TenantId(modifierOptionId, tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_OPTION_NOT_IN_TENANT));

        // Kiểm tra tên mới đã tồn tại chưa (ngoại trừ chính nó)
        if (!modifierOption.getName().equals(request.getName())) {
            modifierOptionRepository.findByNameAndModifierGroup_ModifierGroupIdAndModifierGroup_Tenant_TenantId(request.getName(), modifierOption.getModifierGroup().getModifierGroupId(), tenantId)
                    .ifPresent(option -> {
                        throw new AppException(ErrorCode.MODIFIER_OPTION_ALREADY_EXISTS);
                    });
        }

        // Cập nhật
        modifierOptionMapper.updateModifierOption(request, modifierOption);
        ModifierOption updatedOption = modifierOptionRepository.save(modifierOption);

        ModifierOptionResponse response = modifierOptionMapper.toModifierOptionResponse(updatedOption);
        response.setModifierGroupId(updatedOption.getModifierGroup().getModifierGroupId());
        response.setModifierGroupName(updatedOption.getModifierGroup().getName());
        return response;
    }

    @Override
    public void deleteModifierOption(Integer modifierOptionId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Kiểm tra xem option có thuộc tenant của user không
        ModifierOption modifierOption = modifierOptionRepository.findByModifierOptionIdAndModifierGroup_Tenant_TenantId(modifierOptionId, tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_OPTION_NOT_IN_TENANT));

        modifierOptionRepository.deleteById(modifierOptionId);
    }

    @Override
    public ModifierOptionResponse updateIsActiveModifierOption(Integer modifierOptionId, UpdateModifierOptionIsActiveRequest updateModifierOptionIsActiveRequest, JwtAuthenticationToken jwtAuthenticationToken) {

        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        // Kiem tra ModifireOption co ton tai khong
        ModifierOption modifierOption= modifierOptionRepository.findById(modifierOptionId)
                .orElseThrow(()-> new AppException(ErrorCode.MODIFIER_OPTION_NOT_FOUND));

        // Kiểm tra xem option có thuộc tenant của user không
        modifierOption = modifierOptionRepository.findByModifierOptionIdAndModifierGroup_Tenant_TenantId(modifierOptionId, tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_OPTION_NOT_IN_TENANT));

        modifierOption.setIsActive(updateModifierOptionIsActiveRequest.getIsActive());
        ModifierOption updatedOption = modifierOptionRepository.save(modifierOption);

        // Tra ve reposne
        ModifierOptionResponse response = modifierOptionMapper.toModifierOptionResponse(updatedOption);
        response.setModifierGroupId(updatedOption.getModifierGroup().getModifierGroupId());
        response.setModifierGroupName(updatedOption.getModifierGroup().getName());
        return response;


    }


}
