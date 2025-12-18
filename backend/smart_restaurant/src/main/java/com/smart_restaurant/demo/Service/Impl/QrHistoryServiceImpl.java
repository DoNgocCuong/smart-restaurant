package com.smart_restaurant.demo.Service.Impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.smart_restaurant.demo.Repository.QrHistoryRepository;
import com.smart_restaurant.demo.Repository.TableRepository;
import com.smart_restaurant.demo.Service.QrHistoryService;
import com.smart_restaurant.demo.Service.TenantService;
import com.smart_restaurant.demo.dto.Response.QrResponse;
import com.smart_restaurant.demo.entity.QrHistory;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.QrHistoryMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
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

    private final Cloudinary cloudinary; // inject từ CloudinaryConfig
    private final TenantService tenantService;
    QrHistoryRepository qrHistoryRepository;
    TableRepository tableRepository;
    QrHistoryMapper qrHistoryMapper;



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
        QrHistory qrHistory=new QrHistory();
        qrHistory.setActive(true);
        qrHistory.setQr_url(qrUrl);
        qrHistory.setRestaurantTable(tableRepository.findById(tableId).get());
        return qrHistoryMapper.toQrResponse(qrHistoryRepository.save(qrHistory));
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
        if (now - timestamp > 3600000) {
            return false;
        }

        return valid;

    }
    public void verify(String token, HttpServletResponse response) throws NoSuchAlgorithmException, InvalidKeyException, IOException {
        boolean ok = verifyTableQRCode(token);
        String[] parts = token.split("\\.");
        if (parts.length != 4) throw new AppException(ErrorCode.INVALID_TOKEN_FORMAT);

        Integer tenantId = Integer.parseInt(parts[0]);
        Integer tableId = Integer.parseInt(parts[1]);
        String redirectUrl = ok ? "http://172.16.25.32/api/order/"+tenantId+"/tables/"+tableId : "http://172.16.25.32/api/qr/error";
        response.sendRedirect(redirectUrl);
    }


}
