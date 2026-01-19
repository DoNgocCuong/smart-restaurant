package com.smart_restaurant.demo.Controller;


import com.smart_restaurant.demo.Service.ModifierGroupService;
import com.smart_restaurant.demo.dto.Request.ModifierGroupRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierGroupIsActiveRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierGroupRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu/modifier-group")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ModifierGroupController {

    ModifierGroupService modifierGroupService;

    @PostMapping("")
    public ApiResponse<ModifierGroupResponse> createModifierGroup(@Valid @RequestBody ModifierGroupRequest modifierGroupRequest, JwtAuthenticationToken jwtAuthenticationToken){
        ModifierGroupResponse modifierGroup = modifierGroupService.createModifierGroup(modifierGroupRequest, jwtAuthenticationToken);

        return ApiResponse.<ModifierGroupResponse>builder()
                .message("ModifierGroup create successfully")
                .result(modifierGroup)
                .build();


    }
    @GetMapping("")
    public ApiResponse<List<ModifierGroupResponse>> getAllModifierGroup(JwtAuthenticationToken jwtAuthenticationToken){
        List<ModifierGroupResponse> modifierGroupResponse = modifierGroupService.getAllModifierGroup(jwtAuthenticationToken);

        return ApiResponse.<List<ModifierGroupResponse>>builder()
                .message("get all ModifierGroup successfully")
                .result(modifierGroupResponse)
                .build();

    }
    @GetMapping("/{modifierGroupId}")
    public ApiResponse<ModifierGroupResponse> getModifierGroupDetail(
            @PathVariable Integer modifierGroupId,
            JwtAuthenticationToken jwtAuthenticationToken) {
        ModifierGroupResponse modifierGroupResponse = modifierGroupService.getModifierGroupDetail(modifierGroupId, jwtAuthenticationToken);

        return ApiResponse.<ModifierGroupResponse>builder()
                .message("Get ModifierGroup detail successfully")
                .result(modifierGroupResponse)
                .build();
    }

    @PutMapping("/{modifierGroupId}")
    public ApiResponse<ModifierGroupResponse> updateModifierGroup(
            @PathVariable Integer modifierGroupId,
            @Valid @RequestBody UpdateModifierGroupRequest updateRequest,
            JwtAuthenticationToken jwtAuthenticationToken) {
        ModifierGroupResponse modifierGroupResponse = modifierGroupService.updateModifierGroup(modifierGroupId, updateRequest, jwtAuthenticationToken);

        return ApiResponse.<ModifierGroupResponse>builder()
                .message("ModifierGroup updated successfully")
                .result(modifierGroupResponse)
                .build();
    }

    @PatchMapping("/isActive/{modifierGroupId}")
    public ApiResponse<ModifierGroupResponse> updateModifierGroupIsActive(
            @PathVariable Integer modifierGroupId,
            @Valid @RequestBody UpdateModifierGroupIsActiveRequest updateRequest,
            JwtAuthenticationToken jwtAuthenticationToken) {
        ModifierGroupResponse modifierGroupResponse = modifierGroupService.updateIsActiveModifierGroup(modifierGroupId, updateRequest, jwtAuthenticationToken);

        return ApiResponse.<ModifierGroupResponse>builder()
                .message("Xoa thanh cong modifierGroup")
                .result(modifierGroupResponse)
                .build();
    }

    @DeleteMapping("/{modifierGroupId}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> deleteModifierGroup(
            @PathVariable Integer modifierGroupId,
            JwtAuthenticationToken jwtAuthenticationToken) {
        modifierGroupService.deleteModifierGroup(modifierGroupId, jwtAuthenticationToken);

        return ApiResponse.<Void>builder()
                .message("ModifierGroup deleted successfully")
                .build();
    }

}
