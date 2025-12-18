package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Request.TableRequest;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface TableService {
    TableResponse createTable(TableRequest tableRequest, JwtAuthenticationToken jwtAuthenticationToken);
    Page<TableResponse> getAllTable(Integer pageNumber, Integer pageSize,Integer tenantId);
}
