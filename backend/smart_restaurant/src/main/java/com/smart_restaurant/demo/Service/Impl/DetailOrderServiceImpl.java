package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.DetailOrderRepository;
import com.smart_restaurant.demo.Repository.ItemRepository;
import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Service.DetailOrderService;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import com.smart_restaurant.demo.dto.Response.OrderNotification;
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
import java.util.ArrayList;
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
    NotificationService notificationService;


    @Transactional
    @Override
    public List<DetailOrderResponse> approveAllDetailOrders(Integer orderId) {
        // 1. Kiểm tra Order tồn tại
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // 2. Lấy tất cả DetailOrder của order này
        List<DetailOrder> allDetailOrders = detailOrderRepository.findByOrder_OrderId(orderId);

        if (allDetailOrders.isEmpty()) {
            throw new AppException(ErrorCode.NO_DETAIL_ORDER_FOUND);
        }

        List<DetailOrderResponse> responses = new ArrayList<>();

        // 3. Duyệt từng DetailOrder
        for (DetailOrder detailOrder : allDetailOrders) {
            // Kiểm tra xem đã approved chưa
            if (detailOrder.getIsApproved() != null && detailOrder.getIsApproved()) {
                System.out.println("⚠️ DetailOrder " + detailOrder.getDetailOrderId() + " đã được duyệt trước đó");
                continue; // Skip nếu đã approved
            }

            // Set isApproved = true
            detailOrder.setIsApproved(true);
            DetailOrder approvedDetail = detailOrderRepository.save(detailOrder);

            // Cập nhật quantity_sold
            Item item = approvedDetail.getItem();
            if (item != null) {
                int currentSold = item.getQuantitySold() != null ? item.getQuantitySold() : 0;
                item.setQuantitySold(currentSold + approvedDetail.getQuantity());
                itemRepository.save(item);
                System.out.println("📊 Cập nhật quantity_sold: Item " + item.getItemId() + " +" + approvedDetail.getQuantity());
            }

            responses.add(detailOrderMapper.toDetailOrderResponse(approvedDetail));
            System.out.println("✅ Đã duyệt DetailOrder " + detailOrder.getDetailOrderId());
        }

        // 4. Cập nhật Order
        order.setUpdateAt(LocalDateTime.now());

        // 5. Tính lại subtotal của toàn bộ order
        List<DetailOrder> updatedDetailOrders = detailOrderRepository.findByOrder_OrderId(orderId);
        float totalSubtotal = 0;

        for (DetailOrder detail : updatedDetailOrders) {
            double itemTotal = detail.getPrice() * detail.getQuantity();
            if (detail.getModifies() != null && !detail.getModifies().isEmpty()) {
                for (ModifierOption modifier : detail.getModifies()) {
                    itemTotal += modifier.getPrice() * detail.getQuantity();
                }
            }
            totalSubtotal += itemTotal;
        }

        order.setSubtotal(totalSubtotal);
        orderRepository.save(order);

        System.out.println("✅ Đã duyệt tất cả DetailOrder của Order ");
        OrderNotification orderNotification=OrderNotification.builder()
                .orderId(orderId)
                .tableId(order.getTable().getTableId())
                .message("Khách yêu cầu thêm món ăn cho đơn hàng.")
                .build();
        notificationService.notifyNewOrder(orderNotification);
        return responses;
    }
}
