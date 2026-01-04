package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.DiscountRepository;
import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Repository.StatusRepository;
import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.dto.Response.InvoiceResponse;
import com.smart_restaurant.demo.entity.Discount;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.enums.DiscountType;
import com.smart_restaurant.demo.enums.OrderStatus;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.OrderMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    DiscountRepository discountRepository;
    OrderMapper orderMapper;
    StatusRepository statusRepository;
    @Override
    public InvoiceResponse createInvoice(Integer orderId ){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        List<Discount> discountList = discountRepository.findAll();

        Discount discountApply = null;
        for (Discount discount : discountList) {
            if (discount.getMinApply() <= order.getSubtotal()
                    && discount.getMaxApply() >= order.getSubtotal()
                    && Boolean.TRUE.equals(discount.getIsActive())) {
                discountApply = discount;
                break;
            }
        }

        float subtotal = order.getSubtotal();
        float discountAmount = 0;
        Integer taxRate = 5;
        float taxAmount;
        float total;

        if (discountApply != null) {
            if (discountApply.getDiscountType() == DiscountType.Percent) {
                discountAmount = subtotal * discountApply.getValue() / 100;
            } else if (discountApply.getDiscountType() == DiscountType.Fixed) {
                discountAmount = discountApply.getValue();
            }
        }

        float afterDiscount = subtotal - discountAmount;

        taxAmount = afterDiscount * taxRate / 100;

        total = afterDiscount + taxAmount;

        order.setTax(taxRate);
        order.setTotal(total);
        Status status=order.getStatus();
        status.setOrderStatus(OrderStatus.Pending_payment);
        statusRepository.save(status);
        InvoiceResponse invoiceResponse=orderMapper.toInvoiceResponse(orderRepository.save(order));
        invoiceResponse.setTableName(order.getTable().getTableName());
        return invoiceResponse;
    }

}
