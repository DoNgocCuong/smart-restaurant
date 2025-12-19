package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.QrResponse;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface QrHistoryService {
    QrResponse generateTableQRCode(Integer tableId, JwtAuthenticationToken jwtAuthenticationToken) throws Exception;
    boolean verifyTableQRCode(String token) throws NoSuchAlgorithmException, InvalidKeyException;
    void verify(String token, HttpServletResponse response) throws NoSuchAlgorithmException, InvalidKeyException, IOException;

    public List<QrResponse> getAllTableQRCode(JwtAuthenticationToken jwtAuthenticationToken);
}
