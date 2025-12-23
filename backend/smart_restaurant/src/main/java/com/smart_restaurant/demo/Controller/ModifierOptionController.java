package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.ModifierOptionService;
import com.smart_restaurant.demo.dto.Request.ModifierOptionRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierOptionRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.ModifierOptionResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu/modifier-option")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ModifierOptionController {
    ModifierOptionService modifierOptionService;

    @PostMapping("")
    public ApiResponse<ModifierOptionResponse> createModifierOption(
            @Valid @RequestBody ModifierOptionRequest request,
            JwtAuthenticationToken jwtAuthenticationToken) {
        ModifierOptionResponse response = modifierOptionService.createModifierOption(request, jwtAuthenticationToken);

        return ApiResponse.<ModifierOptionResponse>builder()
                .message("ModifierOption created successfully")
                .result(response)
                .build();
    }

    @GetMapping("")
    public ApiResponse<List<ModifierOptionResponse>> getAllModifierOption(
            JwtAuthenticationToken jwtAuthenticationToken) {
        List<ModifierOptionResponse> response = modifierOptionService.getAllModifierOption(jwtAuthenticationToken);

        return ApiResponse.<List<ModifierOptionResponse>>builder()
                .message("Get all ModifierOption successfully")
                .result(response)
                .build();
    }



    @GetMapping("/group/{modifierGroupId}")
    public ApiResponse<List<ModifierOptionResponse>> getAllModifierOptionByModifierGroup(
            @PathVariable Integer modifierGroupId,
            JwtAuthenticationToken jwtAuthenticationToken) {
        List<ModifierOptionResponse> response = modifierOptionService.getAllModifierOptionByModifierGroup(modifierGroupId, jwtAuthenticationToken);

        return ApiResponse.<List<ModifierOptionResponse>>builder()
                .message("Get all ModifierOption successfully")
                .result(response)
                .build();
    }

    @GetMapping("/{modifierOptionId}")
    public ApiResponse<ModifierOptionResponse> getModifierOptionDetail(
            @PathVariable Integer modifierOptionId,
            JwtAuthenticationToken jwtAuthenticationToken) {
        ModifierOptionResponse response = modifierOptionService.getModifierOptionDetail(modifierOptionId, jwtAuthenticationToken);

        return ApiResponse.<ModifierOptionResponse>builder()
                .message("Get ModifierOption detail successfully")
                .result(response)
                .build();
    }

    @PutMapping("/{modifierOptionId}")
    public ApiResponse<ModifierOptionResponse> updateModifierOption(
            @PathVariable Integer modifierOptionId,
            @Valid @RequestBody UpdateModifierOptionRequest request,
            JwtAuthenticationToken jwtAuthenticationToken) {
        ModifierOptionResponse response = modifierOptionService.updateModifierOption(modifierOptionId, request, jwtAuthenticationToken);

        return ApiResponse.<ModifierOptionResponse>builder()
                .message("ModifierOption updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{modifierOptionId}")
    public ApiResponse<Void> deleteModifierOption(
            @PathVariable Integer modifierOptionId,
            JwtAuthenticationToken jwtAuthenticationToken) {
        modifierOptionService.deleteModifierOption(modifierOptionId, jwtAuthenticationToken);

        return ApiResponse.<Void>builder()
                .message("ModifierOption deleted successfully")
                .build();
    }
}
