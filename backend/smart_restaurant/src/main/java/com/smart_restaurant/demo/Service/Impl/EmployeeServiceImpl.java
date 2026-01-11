package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.EmployeeRepository;
import com.smart_restaurant.demo.Repository.TableRepository;
import com.smart_restaurant.demo.Service.EmployeeService;
import com.smart_restaurant.demo.dto.Response.TableResponseActive;
import com.smart_restaurant.demo.entity.Employee;
import com.smart_restaurant.demo.entity.RestaurantTable;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.TableMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeServiceImpl implements EmployeeService {
    EmployeeRepository employeeRepository;
    TableMapper tableMapper;
    TableRepository tableRepository;
    @Override
    public List<TableResponseActive> servingEmployee(JwtAuthenticationToken jwtAuthenticationToken) {
        Employee employee=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).orElseThrow(()-> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        List<RestaurantTable> restaurantTables=tableRepository.findAllByEmployees_EmployeeId(employee.getEmployeeId());
        return tableMapper.toListTableResponseActive(restaurantTables);
    }
}
