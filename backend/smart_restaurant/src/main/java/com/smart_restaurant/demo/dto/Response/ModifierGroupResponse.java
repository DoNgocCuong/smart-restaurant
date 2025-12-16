package com.smart_restaurant.demo.dto.Response;

import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.ModifierOption;
import com.smart_restaurant.demo.entity.Tenant;
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
    List<Item> items;
    List<ModifierOption> options;
    Integer tenantId;
}
