package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.DetailOrderRepository;
import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Service.DetailOrderService;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.DetailOrder;
import com.smart_restaurant.demo.entity.Item;
import com.smart_restaurant.demo.entity.ModifierOption;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.DetailOrderMapper;
import com.smart_restaurant.demo.mapper.OrderMapper;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DetailOrderServiceImpl implements DetailOrderService {
    DetailOrderRepository detailOrderRepository;
    DetailOrderMapper detailOrderMapper;
    ItemRepository itemRepository;
    OrderRepository orderRepository;
    OrderMapper orderMapper;


    @Transactional
    @Override
    public DetailOrderResponse approveDetailOrder(Integer detailOrderId) {
        // 1. Kiểm tra DetailOrder tồn tại
        DetailOrder detailOrder = detailOrderRepository.findById(detailOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.DETAIL_ORDER_NOT_FOUND));

        // 2. Kiểm tra xem đã approved chưa
        if (detailOrder.getIsApproved() != null && detailOrder.getIsApproved()) {
            throw new AppException(ErrorCode.DETAIL_ORDER_ALREADY_APPROVED);
        }

        // 3. Set isApproved = true
        detailOrder.setIsApproved(true);

        // 4. Lưu lại
        DetailOrder approvedDetail = detailOrderRepository.save(detailOrder);

        // 5. Cập nhật quantity_sold ( số lượng bán được )
        Item item = approvedDetail.getItem();
        if (item != null) {
            int currentSold = item.getQuantitySold() != null ? item.getQuantitySold() : 0;
            item.setQuantitySold(currentSold + approvedDetail.getQuantity());
            itemRepository.save(item);
            System.out.println("📊 Cập nhật quantity_sold: Item " + item.getItemId() + " +" + approvedDetail.getQuantity());
        }

        // 6. Cập nhật order
        Order order = approvedDetail.getOrder();
        order.setUpdateAt(LocalDateTime.now());

        // 7. Tính lại subtotal của toàn bộ order
        List<DetailOrder> allDetailOrders = detailOrderRepository.findByOrder_OrderId(order.getOrderId());
        float totalSubtotal = 0;
        for (DetailOrder detail : allDetailOrders) {
            double itemTotal = detail.getPrice() * detail.getQuantity();
            if (detail.getModifies() != null && !detail.getModifies().isEmpty()) {
                for (ModifierOption modifier : detail.getModifies()) {
                    itemTotal += modifier.getPrice() * detail.getQuantity();
                }
            }
            totalSubtotal += itemTotal;
        }

        order.setSubtotal(totalSubtotal);
        Order updatedOrder = orderRepository.save(order);
        System.out.println("✅ Đã duyệt DetailOrder " + detailOrderId);
        // 5. Return response
        return detailOrderMapper.toDetailOrderResponse(approvedDetail);
    }
}
