package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.client.MomoApi;
import com.smart_restaurant.demo.Service.MomoPaymentService;
import com.smart_restaurant.demo.Service.PaymentService;
import com.smart_restaurant.demo.dto.Request.MomoPaymentRequest;
import com.smart_restaurant.demo.dto.Response.MomoPaymentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MomoPaymentServiceImpl implements MomoPaymentService {

    @Value("${momo.partner-code}")
    private String PARTNER_CODE;

    @Value("${momo.access-key}")
    private String ACCESS_KEY;

    @Value("${momo.secret-key}")
    private String SECRET_KEY;

    @Value("${momo.endpoint}")
    private String ENDPOINT;

    @Value("${momo.return-url}")
    private String REDIRECT_URL;

    @Value("${momo.ipn-url}")
    private String IPN_URL;

    @Value(("${momo.request-type}"))
    private String REQUEST_TYPE;

    private final MomoApi momoApi;
    private final PaymentService paymentService;

    @Override
    public MomoPaymentResponse createQR(Integer orderId, Long amount, String orderInfo) {

            String momoOrderId = orderId + "_" + System.currentTimeMillis();
            String requestId = UUID.randomUUID().toString();
            String extraData = "";

            String rawSignature = String.format(
                    "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                    ACCESS_KEY, amount, extraData, IPN_URL, momoOrderId, orderInfo, PARTNER_CODE, REDIRECT_URL, requestId, REQUEST_TYPE);


            String prettySignature = "";
            try {
                prettySignature = signHmacSHA256(rawSignature, SECRET_KEY);
            } catch (Exception e) {
                log.error(">>>> Co loi khi hash code: " + e);
                return null;
            }

            if (prettySignature.isBlank()) {
                log.error(">>>> signature is blank");
                return null;
            }

        long expireTime = System.currentTimeMillis() + 15 * 60 * 1000;

            MomoPaymentRequest request = MomoPaymentRequest.builder()
                    .partnerCode(PARTNER_CODE)
                    .requestType(REQUEST_TYPE)
                    .ipnUrl(IPN_URL)
                    .redirectUrl(REDIRECT_URL)
                    .orderId(momoOrderId)
                    .orderInfo(orderInfo)
                    .requestId(requestId)
                    .extraData(extraData)
                    .amount(amount)
                    .signature(prettySignature)
                    .expireTime(expireTime)
                    .lang("vi")
                    .build();

        MomoPaymentResponse response = momoApi.createMomoQR(request);

        // Save payment record with PENDING status
        if (response != null && response.getResultCode() == 0) {
            try {
                paymentService.createPayment(orderId, amount, requestId, momoOrderId);
                log.info("Payment record created successfully for orderId: {}", orderId);
            } catch (Exception e) {
                log.error("Error creating payment record: ", e);
            }
        }

        return response;



    }


    private String signHmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);

        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();

        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }

        return hexString.toString();
    }
}