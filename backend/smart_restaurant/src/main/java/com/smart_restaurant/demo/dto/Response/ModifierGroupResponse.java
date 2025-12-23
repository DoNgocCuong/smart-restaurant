package com.smart_restaurant.demo.dto.Response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.ModifierOption;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.enums.SelectionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ModifierGroupResponse {
    Integer modifierGroupId;
    String name;
    private SelectionType selectionType;
    private Boolean isRequired;
    @JsonManagedReference
    List<Item> items;
    @JsonManagedReference
    List<ModifierOption> options;
    Integer tenantId;
}
