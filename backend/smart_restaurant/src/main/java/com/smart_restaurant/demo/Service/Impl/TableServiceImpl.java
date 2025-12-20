
package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.TableRepository;
import com.smart_restaurant.demo.Repository.TenantRepository;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.TableService;
import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Request.UpdateIsActiveTableRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTableRequest;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import com.smart_restaurant.demo.dto.Response.TableResponseActive;
import com.smart_restaurant.demo.entity.Account;
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
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableServiceImpl implements TableService {

    TableRepository tableRepository;
    TableMapper tableMapper;
    AccountService accountService;
    TenantRepository tenantRepository;
    AccountRepository accountRepository;



    @Override
    public TableResponse createTable(TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        // Lấy tenant_id từ username trong JWT
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));


        tableRepository.findByTableName(tableRequest.getTableName())
                .ifPresent(t -> { throw new AppException(ErrorCode.TABLE_NOT_FOUND); });

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
        tableResponse.setTenantId(restaurantTable.getTenant().getTenantId());
        tableResponse.setOrders(restaurantTable.getOrders());
        tableResponse.setStatusTable(restaurantTable.getStatusTable());
        return tableResponse;
    }

    @Override
    public Page<TableResponse> getAllTable(Integer pageNumber, Integer pageSize, Integer tenantId) {
        Pageable pageable = PageRequest.of(pageNumber - 1 ,pageSize, Sort.by("tableId").descending());
        Page<RestaurantTable> restaurantTables = tableRepository.findAllByTenant_TenantId(tenantId, pageable);
        return restaurantTables.map(restaurantTable -> {
            TableResponse response = tableMapper.toTableResponse(restaurantTable);
            response.setTenantId(restaurantTable.getTenant().getTenantId());
            response.setOrders(restaurantTable.getOrders());
            response.setStatusTable(restaurantTable.getStatusTable());
            return response;
        });
    }

    @Override
    public TableResponse updateTable(Integer id, UpdateTableRequest updateTableRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        RestaurantTable restaurantTable = tableRepository.findById(id)
                .orElseThrow(() -> new AppException((ErrorCode.TABLE_NOT_FOUND)));

        if(!restaurantTable.getTenant().getTenantId().equals(tenantId)){
            throw new AppException(ErrorCode.TABLE_NOT_BELONGS_TO_TENANT);

        }

        tableMapper.updateTable(restaurantTable,updateTableRequest);
        restaurantTable = tableRepository.save(restaurantTable);
        TableResponse updateTableResponse = tableMapper.toTableResponse(restaurantTable);
        updateTableResponse.setTenantId(restaurantTable.getTenant().getTenantId());
        updateTableResponse.setOrders(restaurantTable.getOrders());

        return tableMapper.toTableResponse(restaurantTable);
    }

    @Override
    public TableResponse updateStatusTable(Integer id, UpdateIsActiveTableRequest updateIsActiveTableRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        RestaurantTable restaurantTable = tableRepository.findById(id)
                .orElseThrow(() -> new AppException((ErrorCode.TABLE_NOT_FOUND)));

        if(!restaurantTable.getTenant().getTenantId().equals(tenantId)){
            throw new AppException(ErrorCode.TABLE_NOT_BELONGS_TO_TENANT);

        }

        restaurantTable.setIs_active(updateIsActiveTableRequest.getIs_active());
        restaurantTable = tableRepository.save(restaurantTable);
        TableResponse updateTableResponse = tableMapper.toTableResponse(restaurantTable);
        updateTableResponse.setTenantId(restaurantTable.getTenant().getTenantId());
        updateTableResponse.setOrders(restaurantTable.getOrders());
        updateTableResponse.setStatusTable(restaurantTable.getStatusTable());

        return tableMapper.toTableResponse(restaurantTable);
    }

    @Override
    public List<TableResponseActive> getAllTableActive(JwtAuthenticationToken jwtAuthenticationToken) {
        String username= jwtAuthenticationToken.getName();
        Account account=accountRepository.findByUsername(username).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        List<RestaurantTable> restaurantTables=tableRepository.findAllByTenant_TenantId(account.getTenant().getTenantId());
        return restaurantTables.stream()
                .filter(t -> Boolean.TRUE.equals(t.getIs_active()))
                .map(tableMapper::toTableResponseActive)
                .toList();

    }
}

