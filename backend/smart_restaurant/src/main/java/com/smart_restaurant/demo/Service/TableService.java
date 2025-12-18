

package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface TableService {
    TableResponse createTable(TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken);
    List<TableResponse> getAllTable(JwtAuthenticationToken jwtAuthenticationToken);
    Page<TableResponse> getAllTable(Integer pageNumber, Integer pageSize,Integer tenantId);
    TableResponse updateTable(Integer id, UpdateTableRequest updateTableRequest, JwtAuthenticationToken jwtAuthenticationToken);
}