package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.ModifierOptionRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierOptionIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierOptionRequest;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.dto.Response.ModifierOptionResponse;
import com.smart_restaurant.demo.entity.ModifierOption;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface ModifierOptionService {
    ModifierOptionResponse createModifierOption(ModifierOptionRequest request, JwtAuthenticationToken jwtAuthenticationToken);

    List<ModifierOptionResponse> getAllModifierOptionByModifierGroup(Integer modifierGroupId, JwtAuthenticationToken jwtAuthenticationToken);

    List<ModifierOptionResponse> getAllModifierOption(JwtAuthenticationToken jwtAuthenticationToken);

    ModifierOptionResponse getModifierOptionDetail(Integer modifierOptionId, JwtAuthenticationToken jwtAuthenticationToken);

    ModifierOptionResponse updateModifierOption(Integer modifierOptionId, UpdateModifierOptionRequest request, JwtAuthenticationToken jwtAuthenticationToken);

    void deleteModifierOption(Integer modifierOptionId, JwtAuthenticationToken jwtAuthenticationToken);

    ModifierOptionResponse updateIsActiveModifierOption(Integer modifierOptionId, UpdateModifierOptionIsActiveRequest updateModifierOptionIsActiveRequest, JwtAuthenticationToken jwtAuthenticationToken);
}
