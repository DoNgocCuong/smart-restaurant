package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.ModifierGroupRequest;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface ModifierGroupService {
    public ModifierGroupResponse createModifierGroup(ModifierGroupRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    public List<ModifierGroupResponse> getAllModifierGroup(JwtAuthenticationToken jwtAuthenticationToken);

}
