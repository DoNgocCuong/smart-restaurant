package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.TableRepository;
import com.smart_restaurant.demo.Service.TableService;
import com.smart_restaurant.demo.Service.TenantService;
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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TableServiceImpl implements TableService {
    TableRepository tableRepository;
    TableMapper tableMapper;
    TenantService tenantService;
    @Override
    public TableResponse createTable(TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        if(tableRepository.existsByTableName(tableRequest.getTableName()))
            throw  new AppException(ErrorCode.TABLE_ALREADY_EXISTS);
        RestaurantTable restaurantTable=tableMapper.toTable(tableRequest);
        restaurantTable.setTenant(tenantService.tenantId(jwtAuthenticationToken));
        return tableMapper.toTableResponse(tableRepository.save(restaurantTable));
    }

    @Override
    public List<TableResponse> getAllTable(JwtAuthenticationToken jwtAuthenticationToken) {
        Tenant tenant=tenantService.tenantId(jwtAuthenticationToken);
        return tableMapper.toTableResponseList(tableRepository.findAllByTenant_TenantIdAndActiveTrue(tenant.getTenantId()));
    }
}
