package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.TableResponseActive;
import com.smart_restaurant.demo.entity.RestaurantTable;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface EmployeeService {
    List<TableResponseActive> servingEmployee(JwtAuthenticationToken jwtAuthenticationToken);
}
