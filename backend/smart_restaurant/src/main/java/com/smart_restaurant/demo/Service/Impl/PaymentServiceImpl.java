package com.smart_restaurant.demo.Service.Impl;


import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.PaymentService;
import com.smart_restaurant.demo.constant.MomoParameter;
import com.smart_restaurant.demo.dto.Request.TypePaymentResquest;
import com.smart_restaurant.demo.dto.Response.PaymentHistoryResponse;
import com.smart_restaurant.demo.dto.Response.PaymentResponse;
import com.smart_restaurant.demo.entity.*;
import com.smart_restaurant.demo.enums.OrderStatus;
import com.smart_restaurant.demo.enums.StatusTable;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.PaymentMapper;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final StatusRepository statusRepository;
    private final TypePaymentRepository typePaymentRepository;
    AccountRepository accountRepository;
    PaymentMapper paymentMapper;
    CustomerRepository customerRepository;
    TableRepository tableRepository;

    @Override
    @Transactional
    public Payment createPayment(Integer orderId, Long amount, String momoRequestId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        // Lấy status "PENDING" và type payment "MOMO"
        Status pendingStatus = statusRepository.findByOrderStatus(OrderStatus.Pending_payment)
                .orElseThrow(() -> new RuntimeException("Status PENDING not found"));

        TypePayment momoType = typePaymentRepository.findByName("MOMO")
                .orElseThrow(() -> new RuntimeException("TypePayment MOMO not found"));

        Payment payment = Payment.builder()
                .order(order)
                .amount(amount.doubleValue())
                .momoRequestId(momoRequestId)
                .status(pendingStatus)
                .typePayment(momoType)
                .build();

        return paymentRepository.save(payment);


    }

    @Override
    public Payment updatePaymentStatus(Map<String, String> momoResponse) {
        String requestId = momoResponse.get(MomoParameter.REQUEST_ID);
        String transId = momoResponse.get(MomoParameter.TRANS_ID);
        Integer resultCode = Integer.valueOf(momoResponse.get(MomoParameter.RESULT_CODE));

        Payment payment = paymentRepository.findByMomoRequestId(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND_WITH_REQUEST_ID));

        // Update MoMo transaction ID
        payment.setMomoTransId(transId);

        // Update status based on result code
        OrderStatus paymentStatus =
                (resultCode == 0) ? OrderStatus.Paid : OrderStatus.Rejected;

        Status status = statusRepository.findByOrderStatus(paymentStatus)
                .orElseThrow(() -> new AppException(ErrorCode.STATUS_NOT_FOUND));

        payment.setStatus(status);

        // Update order status if payment success
        if (resultCode == 0) {
            Order order = payment.getOrder();

            // ✅ SỬA: PAID thay vì PENDING_PAYMENT
            Status orderPaidStatus = statusRepository.findByOrderStatus(OrderStatus.Paid)
                    .orElseThrow(() -> new AppException(ErrorCode.STATUS_PAID_NOT_FOUND));
            order.setStatus(orderPaidStatus);
            orderRepository.save(order);

            // ✅ THÊM: Set bàn thành trống
            RestaurantTable table = order.getTable();
            if (table != null) {
                table.setStatusTable(StatusTable.unoccupied);
                tableRepository.save(table);
            }
        }

        return paymentRepository.save(payment);
    }


    @Override
    public Payment findByOrderId(Integer orderId) {
        return paymentRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND_FOR_ORDER));
    }

    @Override
    public PaymentResponse updatePaymentType(TypePaymentResquest typePaymentResquest, Integer orderId) {
        Order order=orderRepository.findById(orderId).orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_EXISTED));
        TypePayment typePayment=typePaymentRepository.findByName(typePaymentResquest.getPaymentType()).orElseThrow(()-> new AppException(ErrorCode.TYPE_PAYMENT_NOT_FOUND));
        Payment payment=order.getPayments();
        payment.setTypePayment(typePayment);
        return  paymentMapper.toPaymentResponse(paymentRepository.save(payment));
    }

    @Override
    public List<PaymentHistoryResponse> getPaymentHistory(JwtAuthenticationToken jwtAuthenticationToken) {
        Customer customer=customerRepository.findByAccount_Username(jwtAuthenticationToken.getName()).orElseThrow(()-> new AppException(ErrorCode.ACCOUNT_EXISTED));
        List<Order> orders=orderRepository.findAllByCustomer_CustomerId(customer.getCustomerId());
        List<Payment> payments = new ArrayList<>();
        for(Order order : orders){
            if(order.getStatus().getOrderStatus().equals(OrderStatus.Paid)) {
                payments.add(order.getPayments());
            }
        }
        return paymentMapper.toPaymentHistoryResponse(payments);

    }
}
