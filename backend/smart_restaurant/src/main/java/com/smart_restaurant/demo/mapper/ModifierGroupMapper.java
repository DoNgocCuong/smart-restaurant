package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.ModifierGroupRequest;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.entity.ModifierGroup;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ModifierGroupMapper {

    ModifierGroup toModifierGroup(ModifierGroupRequest modifierGroupRequest);
    ModifierGroupResponse toModifierGroupResponse(ModifierGroup modifierGroup);
}
