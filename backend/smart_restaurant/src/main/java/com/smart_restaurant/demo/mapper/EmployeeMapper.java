package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Request.SignupKitchenRequest;
import com.smart_restaurant.demo.dto.Request.SignupStaffRequest;
import com.smart_restaurant.demo.entity.Employee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    Employee toEmployee(SignupStaffRequest signupStaffRequest);
    Employee toEmployeeKitchen(SignupKitchenRequest signupKitchenRequest);
}
