
package com.smart_restaurant.demo.Controller;


import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.TableService;
import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Request.UpdateIsActiveTableRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTableRequest;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tables")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableController {
    TableService tableService;
    AccountService accountService;
    TenantRepository tenantRepository;

    @PostMapping("")
    public ApiResponse<TableResponse> createTable(@Valid @RequestBody TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken){
        TableResponse tableResponse = tableService.createTable(tableRequest,jwtAuthenticationToken);
        return ApiResponse.<TableResponse>builder()
                .message("Tạo Table Thành Công")
                .result(tableResponse)
                .build();

    }

    @GetMapping("")
    public ApiResponse<Page<TableResponse>> getAllTable(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize,
            JwtAuthenticationToken jwtToken){

        String username = jwtToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        Page<TableResponse> tableResponse= tableService.getAllTable(pageNumber,pageSize,tenantId);
        return ApiResponse.<Page<TableResponse>>builder()
                .result(tableResponse)
                .message("get all thành công")
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<TableResponse> updateTable(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateTableRequest updateTableRequest,
            JwtAuthenticationToken jwtAuthenticationToken){

        TableResponse tableResponse = tableService.updateTable(id,updateTableRequest,jwtAuthenticationToken);
        return ApiResponse.<TableResponse>builder()
                .message("Update thành công")
                .result(tableResponse)
                .build();


    }

    @PatchMapping("/{id}/status")
    public ApiResponse<TableResponse> updateStatusTable(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateIsActiveTableRequest updateIsActiveTableRequest,
            JwtAuthenticationToken jwtAuthenticationToken){

        TableResponse tableResponse = tableService.updateStatusTable(id,updateIsActiveTableRequest,jwtAuthenticationToken);
        return ApiResponse.<TableResponse>builder()
                .message("Update Status thành công")
                .result(tableResponse)
                .build();
    }


}


