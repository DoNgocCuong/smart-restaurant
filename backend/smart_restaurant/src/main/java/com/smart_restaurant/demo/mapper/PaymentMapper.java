package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.PaymentResponse;
import com.smart_restaurant.demo.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentResponse toPaymentResponse(Payment payment);
}
