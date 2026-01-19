package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.ModifierGroupRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.ModifierGroupService;
import com.smart_restaurant.demo.dto.Request.ModifierGroupRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierGroupIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierGroupRequest;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.dto.Response.ModifierOptionSimpleResponse;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.ModifierGroup;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.enums.SelectionType;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.ModifierGroupMapper;
import com.smart_restaurant.demo.mapper.ModifierOptionMapper;
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
    ModifierOptionMapper modifierOptionMapper;

    @Override
    public ModifierGroupResponse createModifierGroup(ModifierGroupRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        // Kiêm tra tên này đã có chưa vs tenant này
        boolean existsModifierGroup = modifierGroupRepository.existsByNameAndTenantTenantId(request.getName(), tenantId);
        if(existsModifierGroup){
            throw new AppException(ErrorCode.MODIFIER_GROUP_ALREADY_EXISTS_FOR_TENANT);
        }


        // Chuyen sang entity
        ModifierGroup modifierGroup = modifierGroupMapper.toModifierGroup(request);
        modifierGroup.setTenant(tenant);
        modifierGroup.setOptions(new ArrayList<>());
        modifierGroup.setItems(new ArrayList<>());
        modifierGroup.setSelectionType(SelectionType.valueOf(request.getSelectionType().toUpperCase()));
        modifierGroup.setIsRequired(request.getIsRequired() != null ? request.getIsRequired() : false);


        ModifierGroup saveModifierGroup = modifierGroupRepository.save(modifierGroup);
        ModifierGroupResponse modifierGroupResponse = modifierGroupMapper.toModifierGroupResponse(saveModifierGroup);
        List<Integer> itemIds = saveModifierGroup.getItems().stream()
                .map(Item::getItemId)
                .toList();
        modifierGroupResponse.setItem(itemIds);

        List<ModifierOptionSimpleResponse> simpleOptions = saveModifierGroup.getOptions().stream()
                .map(modifierOptionMapper::toModifierOptionSimpleResponse)
                .toList();
        modifierGroupResponse.setOptions(simpleOptions);

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
                    List<Integer> itemIds = group.getItems().stream()
                            .map(Item::getItemId)
                            .toList();
                    response.setItem(itemIds);

                    List<ModifierOptionSimpleResponse> simpleOptions = group.getOptions().stream()
                            .map(modifierOptionMapper::toModifierOptionSimpleResponse)
                            .toList();
                    response.setOptions(simpleOptions);

                    response.setTenantId(group.getTenant().getTenantId());

                    return response;
                }).collect(Collectors.toList());

        return responses;






    }
    @Override
    public ModifierGroupResponse getModifierGroupDetail(Integer modifierGroupId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        ModifierGroup modifierGroup = modifierGroupRepository.findById(modifierGroupId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND));

        // Kiểm tra xem modifier group này thuộc tenant của user không
        if (!modifierGroup.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        ModifierGroupResponse response = modifierGroupMapper.toModifierGroupResponse(modifierGroup);
        List<Integer> itemIds = modifierGroup.getItems().stream()
                .map(Item::getItemId)
                .toList();
        response.setItem(itemIds);

        List<ModifierOptionSimpleResponse> simpleOptions = modifierGroup.getOptions().stream()
                .map(modifierOptionMapper::toModifierOptionSimpleResponse)
                .toList();
        response.setOptions(simpleOptions);

        response.setTenantId(modifierGroup.getTenant().getTenantId());

        return response;
    }

    @Override
    public ModifierGroupResponse updateModifierGroup(Integer modifierGroupId, UpdateModifierGroupRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        ModifierGroup modifierGroup = modifierGroupRepository.findById(modifierGroupId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND));

        // Kiểm tra xem modifier group này thuộc tenant của user không
        if (!modifierGroup.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Kiểm tra tên mới đã tồn tại chưa (ngoại trừ chính nó)
        if (!modifierGroup.getName().equals(request.getName())) {
            boolean existsModifierGroup = modifierGroupRepository.existsByNameAndTenantTenantId(request.getName(), tenantId);
            if (existsModifierGroup) {
                throw new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND);
            }
        }

        // Cập nhật
        modifierGroup.setName(request.getName());
        modifierGroup.setSelectionType(SelectionType.valueOf(request.getSelectionType().toUpperCase()));
        modifierGroup.setIsRequired(request.getIsRequired() != null ? request.getIsRequired() : false);
        ModifierGroup updatedModifierGroup = modifierGroupRepository.save(modifierGroup);

        ModifierGroupResponse response = modifierGroupMapper.toModifierGroupResponse(updatedModifierGroup);
        List<Integer> itemIds = updatedModifierGroup.getItems().stream()
                .map(Item::getItemId)
                .toList();
        response.setItem(itemIds);

        List<ModifierOptionSimpleResponse> simpleOptions = updatedModifierGroup.getOptions().stream()
                .map(modifierOptionMapper::toModifierOptionSimpleResponse)
                .toList();
        response.setOptions(simpleOptions);

        response.setTenantId(updatedModifierGroup.getTenant().getTenantId());

        return response;
    }

    @Override
    public void deleteModifierGroup(Integer modifierGroupId, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        ModifierGroup modifierGroup = modifierGroupRepository.findById(modifierGroupId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND));

        // Kiểm tra xem modifier group này thuộc tenant của user không
        if (!modifierGroup.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Kiểm tra xem modifier group này có đang được sử dụng bởi item nào không
        if (!modifierGroup.getItems().isEmpty()) {
            throw new AppException(ErrorCode.MODIFIER_GROUP_IN_USE);
        }

        modifierGroupRepository.deleteById(modifierGroupId);
    }

    @Override
    public ModifierGroupResponse updateIsActiveModifierGroup(Integer modifierGroupId, UpdateModifierGroupIsActiveRequest updateModifierGroupIsActiveRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);

        ModifierGroup modifierGroup = modifierGroupRepository.findById(modifierGroupId)
                .orElseThrow(() -> new AppException(ErrorCode.MODIFIER_GROUP_NOT_FOUND));

        // Kiểm tra xem modifier group này thuộc tenant của user không
        if (!modifierGroup.getTenant().getTenantId().equals(tenantId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        modifierGroup.setIsActive(updateModifierGroupIsActiveRequest.getIsActive());
        ModifierGroup updatedModifierGroup = modifierGroupRepository.save(modifierGroup);

        // Tra response
        ModifierGroupResponse response = modifierGroupMapper.toModifierGroupResponse(updatedModifierGroup);
        List<Integer> itemIds = updatedModifierGroup.getItems().stream()
                .map(Item::getItemId)
                .toList();
        response.setItem(itemIds);

        List<ModifierOptionSimpleResponse> simpleOptions = updatedModifierGroup.getOptions().stream()
                .map(modifierOptionMapper::toModifierOptionSimpleResponse)
                .toList();
        response.setOptions(simpleOptions);

        response.setTenantId(updatedModifierGroup.getTenant().getTenantId());

        return response;
    }


}
