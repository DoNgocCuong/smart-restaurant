package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.TableRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.TableService;
import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import com.smart_restaurant.demo.entity.RestaurantTable;
import com.smart_restaurant.demo.entity.Tenant;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.TableMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableServiceImpl implements TableService {

    TableRepository tableRepository;
    TableMapper tableMapper;
    AccountService accountService;
    TenantRepository tenantRepository;



    @Override
    public TableResponse createTable(TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        // Lấy tenant_id từ username trong JWT
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));


        tableRepository.findByTableName(tableRequest.getTableName())
                .ifPresent(t -> { throw new AppException(ErrorCode.TABLE_EXITS); });

        RestaurantTable restaurantTable = tableMapper.toTable(tableRequest);
        restaurantTable.setTenant(tenant);
        restaurantTable.setOrders(new ArrayList<>());
        if (tableRequest.getIs_active() == null) {
            restaurantTable.setIs_active(true);
        } else {
            restaurantTable.setIs_active(tableRequest.getIs_active());
        }

        restaurantTable = tableRepository.save(restaurantTable);
        TableResponse tableResponse = tableMapper.toTableResponse(restaurantTable);
        tableResponse.setIs_active(restaurantTable.getIs_active());
        tableResponse.setTenantId(tenantId);
        tableResponse.setOrders(restaurantTable.getOrders());
        return tableResponse;
    }

    @Override
    public Page<TableResponse> getAllTable(Integer pageNumber, Integer pageSize, Integer tenantId) {
        Pageable pageable = PageRequest.of(pageNumber - 1 ,pageSize, Sort.by("tableId").descending());
        Page<RestaurantTable> restaurantTables = tableRepository.findAllByTenant_TenantId(tenantId, pageable);
        return restaurantTables.map(tableMapper::toTableResponse);
    }
}
