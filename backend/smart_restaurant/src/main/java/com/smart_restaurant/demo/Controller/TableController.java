
package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.QrHistoryService;
import com.smart_restaurant.demo.Service.TableService;
import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableController {
    TableService tableService;
    QrHistoryService qrHistoryService;
    @PostMapping("/add-table")
    ApiResponse<TableResponse>createTable(@RequestBody TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<TableResponse>builder()
                .result(tableService.createTable(tableRequest,jwtAuthenticationToken))
                .build();
    }
    @GetMapping
    ApiResponse<List<TableResponse>> getAllTable(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<List<TableResponse>>builder()
                .result(tableService.getAllTable(jwtAuthenticationToken))
                .build();
    }

}

