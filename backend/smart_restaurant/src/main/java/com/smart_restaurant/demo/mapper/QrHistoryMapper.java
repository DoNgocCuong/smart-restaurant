package com.smart_restaurant.demo.mapper;

import com.smart_restaurant.demo.dto.Response.QrResponse;
import com.smart_restaurant.demo.entity.QrHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QrHistoryMapper {
    QrResponse toQrResponse(QrHistory qrHistory);
}
