package com.smart_restaurant.demo.dto.Request;


import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.ModifierOption;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.enums.SelectionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ModifierGroupRequest {
    String name;
    private String selectionType;
    private Boolean isRequired;

}
