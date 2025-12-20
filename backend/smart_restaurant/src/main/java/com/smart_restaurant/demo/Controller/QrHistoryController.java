package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.QrHistoryService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.QrResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QrHistoryController {
    QrHistoryService qrHistoryService;
    @PostMapping("{id}")
    ApiResponse<QrResponse> createQr(@PathVariable Integer id, JwtAuthenticationToken jwtAuthenticationToken) throws Exception {
        return ApiResponse.<QrResponse>builder()
                .result(qrHistoryService.generateTableQRCode(id,jwtAuthenticationToken))
                .build();
    }
    @GetMapping
    ApiResponse<List<QrResponse>> getAllQrCode(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<List<QrResponse>>builder()
                .result(qrHistoryService.getAllTableQRCode(jwtAuthenticationToken))
                .build();
    }
    @GetMapping("/verify")
    void verify(@RequestParam(name = "t") String token,HttpServletResponse response) throws NoSuchAlgorithmException, IOException, InvalidKeyException {
        qrHistoryService.verify(token,  response);
    }
    @GetMapping("/error")
    ApiResponse<String> error(){
        return ApiResponse.<String>builder().result("page error 404 not fause").build();
    }
    @PostMapping
    ApiResponse<List<QrResponse>> refreshAllQr(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<List<QrResponse>>builder()
                .result(qrHistoryService.generateAllTableQrCode(jwtAuthenticationToken))
                .build();
    }
    @GetMapping("/{id}")
    ApiResponse<QrResponse> findOneTableQrCode(@PathVariable Integer id, JwtAuthenticationToken jwtAuthenticationToken){
        return  ApiResponse.<QrResponse>builder()
                .result(qrHistoryService.findOneTableQrCode(id, jwtAuthenticationToken))
                .build();
    }
}

