package com.smart_restaurant.demo.Service.Impl;


import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Repository.PaymentRepository;
import com.smart_restaurant.demo.Repository.StatusRepository;
import com.smart_restaurant.demo.Repository.TypePaymentRepository;
import com.smart_restaurant.demo.Service.PaymentService;
import com.smart_restaurant.demo.constant.MomoParameter;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Payment;
import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.entity.TypePayment;
import com.smart_restaurant.demo.enums.OrderStatus;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new RuntimeException("Payment not found with requestId: " + requestId));

        // Update MoMo transaction ID
        payment.setMomoTransId(transId);

        // Update status based on result code
        OrderStatus paymentStatus =
                (resultCode == 0) ? OrderStatus.Paid : OrderStatus.Deleted;

        Status status = statusRepository.findByOrderStatus(paymentStatus)
                .orElseThrow(() -> new RuntimeException("Status not found: " + paymentStatus));

        payment.setStatus(status);

        // Update order status if payment success
        if (resultCode == 0) {
            Order order = payment.getOrder();
            Status orderPaidStatus = statusRepository.findByOrderStatus(OrderStatus.Pending_payment)
                    .orElseThrow(() -> new RuntimeException("Status PAID not found"));
            order.setStatus(orderPaidStatus);
            orderRepository.save(order);
        }

        return paymentRepository.save(payment);
    }


    @Override
    public Payment findByOrderId(Integer orderId) {
        return paymentRepository.findByOrder_OrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));
    }
}
