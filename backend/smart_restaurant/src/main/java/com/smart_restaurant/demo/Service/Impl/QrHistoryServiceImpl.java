package com.smart_restaurant.demo.Service.Impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.smart_restaurant.demo.Repository.AccountRepository;
import com.smart_restaurant.demo.Repository.QrHistoryRepository;
import com.smart_restaurant.demo.Repository.TableRepository;
import com.smart_restaurant.demo.Service.AuthenticationService;
import com.smart_restaurant.demo.Service.QrHistoryService;
import com.smart_restaurant.demo.Service.TableService;
import com.smart_restaurant.demo.Service.TenantService;
import com.smart_restaurant.demo.dto.Response.QrResponse;
import com.smart_restaurant.demo.dto.Response.TableResponse;
import com.smart_restaurant.demo.dto.Response.TableResponseActive;
import com.smart_restaurant.demo.entity.Account;
import com.smart_restaurant.demo.entity.QrHistory;
import com.smart_restaurant.demo.entity.RestaurantTable;
import com.smart_restaurant.demo.entity.Role;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.QrHistoryMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class QrHistoryServiceImpl implements QrHistoryService {
    @NonFinal
    @Value("${jwt.qrKey}")
    protected String hmacSecret;
    @NonFinal
    @Value("${qr.base-url}")
    protected String baseUrl;
    @NonFinal
    @Value("${qr.width}")
    protected int qrWidth;
    @NonFinal
    @Value("${qr.height}")
    protected int qrHeight;
    @NonFinal
    @Value(("${qr.FE_URL}"))
    protected String fe_url;

    private final Cloudinary cloudinary; // inject từ CloudinaryConfig
    private final TenantService tenantService;
    QrHistoryRepository qrHistoryRepository;
    TableRepository tableRepository;
    QrHistoryMapper qrHistoryMapper;
    AccountRepository accountRepository;
    TableService tableService;
    AuthenticationService authenticationService;




    public String generateTokenHS512(Integer tenantId, Integer tableId) throws Exception {
        long timestamp = Instant.now().getEpochSecond();
        String payload = tenantId + "." + tableId + "." + timestamp;

        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec keySpec = new SecretKeySpec(hmacSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(keySpec);
        byte[] signatureBytes = hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        String signature = Base64.getUrlEncoder().withoutPadding().encodeToString(signatureBytes);

        return payload + "." + signature;
    }

    public BufferedImage generateQRCodeImage(String url) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.MARGIN, 1);
        var bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, qrWidth, qrHeight, hints);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }


    public String uploadQRCodeToCloudinary(BufferedImage qrImage, String publicId) throws Exception {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "PNG", os);
        Map uploadResult = cloudinary.uploader().upload(os.toByteArray(),
                ObjectUtils.asMap("public_id", publicId, "overwrite", true));
        return uploadResult.get("secure_url").toString();
    }


    @Override
    public QrResponse generateTableQRCode(Integer tableId, JwtAuthenticationToken jwtAuthenticationToken) throws Exception {
        Integer tenantId = tenantService.tenantId(jwtAuthenticationToken).getTenantId();
        String token = generateTokenHS512(tenantId, tableId);
        String url = baseUrl + token;
        BufferedImage qrImage = generateQRCodeImage(url);
        String publicId = "qr_table_" + tableId;
        String qrUrl = uploadQRCodeToCloudinary(qrImage, publicId);
        if(qrHistoryRepository.existsByRestaurantTable_TableIdAndActiveTrue(tableId)){
            QrHistory qrHistory=qrHistoryRepository.findByRestaurantTable_TableIdAndActiveTrue(tableId).get();
            qrHistory.setActive(false);
            qrHistoryRepository.save(qrHistory);
        }
        QrHistory qrHistory=new QrHistory();
        qrHistory.setActive(true);
        qrHistory.setQr_url(qrUrl);
        qrHistory.setRestaurantTable(tableRepository.findById(tableId).get());
        qrHistory.setToken(token);
        QrResponse qrResponse=qrHistoryMapper.toQrResponse(qrHistoryRepository.save(qrHistory));
        qrResponse.setCreateAt(qrHistory.getCreateAt());
        return qrResponse;
    }
    @Override
    public boolean verifyTableQRCode(String token) throws NoSuchAlgorithmException, InvalidKeyException {
        String[] parts = token.split("\\.");
        if (parts.length != 4) throw new AppException(ErrorCode.INVALID_TOKEN_FORMAT);

        Integer tenantId = Integer.parseInt(parts[0]);
        Integer tableId = Integer.parseInt(parts[1]);
        long timestamp = Long.parseLong(parts[2]);
        String signature = parts[3];

        String payload = tenantId + "." + tableId + "." + timestamp;
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec keySpec = new SecretKeySpec(hmacSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(keySpec);
        byte[] expectedSig = hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        String expectedSignature = Base64.getUrlEncoder().withoutPadding().encodeToString(expectedSig);

        boolean valid = expectedSignature.equals(signature);
        long now = Instant.now().getEpochSecond();
        QrHistory qrHistory=qrHistoryRepository.findByRestaurantTable_TableIdAndToken(tableId,token).orElseThrow(()-> new AppException(ErrorCode.QR_NOT_EXIST));
        if (now - timestamp > 3600000 || qrHistory.getActive()==false) {
            return false;
        }
        return valid;

    }


    public void verify(String token, HttpServletResponse response)
            throws Exception {
        boolean ok = verifyTableQRCode(token);
        String[] parts = token.split("\\.");
        if (parts.length != 4)
            throw new AppException(ErrorCode.INVALID_TOKEN_FORMAT);

        Integer tenantId = Integer.parseInt(parts[0]);
        Integer tableId = Integer.parseInt(parts[1]);

        if (!ok) {
            response.sendRedirect(fe_url+"/qr/error");
            return;
        }
        String username="guest_tenant_"+tenantId+"@gmail.com";
        Account account=accountRepository.findByTenant_TenantIdAndUsername(tenantId,username).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_EXISTED));

        String accessToken = authenticationService.generalToken(account);

        String redirectUrl = String.format(
                fe_url+"/guest/menu/%d/tables/%d?accessToken=%s",
                tenantId,
                tableId,
                URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
        );

        response.sendRedirect(redirectUrl);
    }



    @Override
    public List<QrResponse> getAllTableQRCode(JwtAuthenticationToken jwtAuthenticationToken) {
        String username= jwtAuthenticationToken.getName();
        Account account=accountRepository.findByUsername(username).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        return qrHistoryMapper.toListQrResponse(qrHistoryRepository.findAllByRestaurantTable_Tenant_TenantIdAndActiveTrue(account.getAccountId()));

    }

    @Override
    public List<QrResponse> generateAllTableQrCode(JwtAuthenticationToken jwtAuthenticationToken) {
        String username= jwtAuthenticationToken.getName();
        Account account=accountRepository.findByUsername(username).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        List<TableResponseActive> restaurantTables=tableService.getAllTableActive(jwtAuthenticationToken);
        return restaurantTables.stream()
                .map(table -> {
                    try {
                        return generateTableQRCode(
                                table.getTableId(),
                                jwtAuthenticationToken
                        );
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
    }

    @Override
    public QrResponse findOneTableQrCode(Integer tableId,JwtAuthenticationToken jwtAuthenticationToken) {
        String username= jwtAuthenticationToken.getName();
        Account account=accountRepository.findByUsername(username).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        QrHistory qrHistory=qrHistoryRepository.findByRestaurantTable_TableIdAndRestaurantTable_Tenant_TenantIdAndActiveTrue(
                                                tableId,account.getTenant().getTenantId()).orElseThrow(()->new AppException(ErrorCode.QR_NOT_EXIST));
        return qrHistoryMapper.toQrResponse(qrHistory);
    }
}
