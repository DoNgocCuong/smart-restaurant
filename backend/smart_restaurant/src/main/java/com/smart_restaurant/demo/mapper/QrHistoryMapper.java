package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.QrResponse;
import com.smart_restaurant.demo.entity.QrHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring",uses = {RestaurantTableMapper.class})
public interface QrHistoryMapper {
    QrResponse toQrResponse(QrHistory qrHistory);
    List<QrResponse> toListQrResponse(List<QrHistory> qrHistories);
}
