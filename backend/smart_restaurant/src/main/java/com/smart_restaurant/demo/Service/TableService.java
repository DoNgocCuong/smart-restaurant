

package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.TableRequest;

import com.smart_restaurant.demo.dto.Request.UpdateIsActiveTableRequest;
import com.smart_restaurant.demo.dto.Request.UpdateTableRequest;

import com.smart_restaurant.demo.dto.Response.TableResponse;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface TableService {
    TableResponse createTable(TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken);
    Page<TableResponse> getAllTable(Integer pageNumber, Integer pageSize, Integer tenantId);
    TableResponse updateTable(Integer id, UpdateTableRequest updateTableRequest, JwtAuthenticationToken jwtAuthenticationToken);
    TableResponse updateStatusTable(Integer id, UpdateIsActiveTableRequest updateIsActiveTableRequest, JwtAuthenticationToken jwtAuthenticationToken);
}

