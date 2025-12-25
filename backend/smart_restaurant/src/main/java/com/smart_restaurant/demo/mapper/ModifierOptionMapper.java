package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.ModifierOptionRequest;
import com.smart_restaurant.demo.dto.Request.UpdateModifierOptionRequest;
import com.smart_restaurant.demo.dto.Response.ModifierOptionResponse;
import com.smart_restaurant.demo.dto.Response.ModifierOptionSimpleResponse;
import com.smart_restaurant.demo.entity.ModifierOption;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ModifierOptionMapper {

    ModifierOption toModifierOption(ModifierOptionRequest request);

    @Mapping(source = "modifierGroup.modifierGroupId", target = "modifierGroupId")
    ModifierOptionResponse toModifierOptionResponse(ModifierOption modifierOption);

    void updateModifierOption(UpdateModifierOptionRequest request, @MappingTarget ModifierOption modifierOption);

    @Mapping(target = "modifierOptionId", source = "modifierOptionId")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "price", source = "price")
    ModifierOptionSimpleResponse toModifierOptionSimpleResponse(ModifierOption modifierOption);
}
