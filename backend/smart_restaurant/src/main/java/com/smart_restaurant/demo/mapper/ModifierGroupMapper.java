package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.ModifierGroupRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierGroupRequest;
import com.smart_restaurant.demo.dto.Response.ModifierGroupResponse;
import com.smart_restaurant.demo.entity.ModifierGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.smart_restaurant.demo.enums.SelectionType;

@Mapper(componentModel = "spring")
public interface ModifierGroupMapper {

    @Mapping(target = "items", ignore = true)
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    @Mapping(source = "selectionType", target = "selectionType")
    @Mapping(source = "isRequired", target = "isRequired")
    ModifierGroup toModifierGroup(ModifierGroupRequest modifierGroupRequest);

    @Mapping(source = "selectionType", target = "selectionType")
    @Mapping(source = "isRequired", target = "isRequired")
    ModifierGroupResponse toModifierGroupResponse(ModifierGroup modifierGroup);

    @Mapping(target = "items", ignore = true)
    @Mapping(target = "options", ignore = true)
    @Mapping(target = "tenant", ignore = true)
    @Mapping(target = "modifierGroupId", ignore = true)
    @Mapping(source = "selectionType", target = "selectionType")
    @Mapping(source = "isRequired", target = "isRequired")
    void updateModifierGroup(UpdateModifierGroupRequest request, @MappingTarget ModifierGroup modifierGroup);
}
