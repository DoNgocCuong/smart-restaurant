package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.EmployeeService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.TableResponseActive;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {
    EmployeeService employeeService;
    // employee
    @GetMapping("/serving")
    public ApiResponse<List<TableResponseActive>> serving(JwtAuthenticationToken jwtAuthenticationToken){
        return  ApiResponse.<List<TableResponseActive>>builder()
                .result(employeeService.servingEmployee(jwtAuthenticationToken))
                .build();
    }
}
