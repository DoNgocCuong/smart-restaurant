package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.ModifierGroupRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierGroupIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierGroupRequest;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface ModifierGroupService {
    public ModifierGroupResponse createModifierGroup(ModifierGroupRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    public List<ModifierGroupResponse> getAllModifierGroup(JwtAuthenticationToken jwtAuthenticationToken);
    public ModifierGroupResponse getModifierGroupDetail(Integer modifierGroupId, JwtAuthenticationToken jwtAuthenticationToken);
    public ModifierGroupResponse updateModifierGroup(Integer modifierGroupId, UpdateModifierGroupRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    public void deleteModifierGroup(Integer modifierGroupId, JwtAuthenticationToken jwtAuthenticationToken);
    public ModifierGroupResponse updateIsActiveModifierGroup(Integer modifierGroupId, UpdateModifierGroupIsActiveRequest updateModifierGroupIsActiveRequest, JwtAuthenticationToken jwtAuthenticationToken);
}
