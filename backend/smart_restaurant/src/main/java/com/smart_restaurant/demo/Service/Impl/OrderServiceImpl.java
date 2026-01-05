package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.dto.Request.DetailOrderRequest;
import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import com.smart_restaurant.demo.dto.Response.ModifierOptionResponse;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.*;
import com.smart_restaurant.demo.enums.OrderStatus;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.DetailOrderMapper;
import com.smart_restaurant.demo.mapper.OrderMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    DetailOrderRepository detailOrderRepository;
    ItemRepository itemRepository;
    ModifierOptionRepository modifierOptionRepository;
    TableRepository tableRepository;
    CustomerRepository customerRepository;
    StatusRepository statusRepository;
    AccountRepository accountRepository;
    DetailOrderMapper detailOrderMapper;
    OrderMapper orderMapper;
    TenantRepository tenantRepository;
    AccountService accountService;

    @Override
    public OrderResponse createOrder(OrderRequest orderRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = null;
        Customer customer = null;
        String customerName = null;
        boolean isHaveName = true; // Mặc định: không đăng nhập

        // Check đăng nhập
        if (jwtAuthenticationToken != null) {
            try {
                isHaveName = false;
                username = jwtAuthenticationToken.getName();

                if (username == null || username.isEmpty()) {
                    System.out.println("⚠️ ERROR: Username từ JWT là null hoặc rỗng!");
                    throw new AppException(ErrorCode.INVALID_TOKEN_FORMAT);
                }

                // Tìm Account bằng username
                Account account = accountRepository.findByUsername(username)
                        .orElseThrow(() -> {
                            return new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
                        });


                // Tìm Customer bằng Account ID
                customer = customerRepository.findByAccountAccountId(account.getAccountId())
                        .orElseThrow(() -> {
                            return new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
                        });

                // Lấy tên từ Customer
                customerName = customer.getName();
                System.out.println("✅ CustomerId: " + customer.getCustomerId());
                System.out.println("✅ CustomerName từ DB: " + customerName);

            } catch (AppException e) {
                System.out.println("❌ Lỗi khi lấy thông tin customer: " + e.getMessage());
                throw e;
            }
        } else {

            customerName = orderRequest.getCustomerName();
            System.out.println("⏸️ Không đăng nhập - CustomerName từ request: " + customerName);
        }

        // Lấy bàn
        RestaurantTable restaurantTable = tableRepository.findById(orderRequest.getTableId())
                .orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_FOUND));

        // Kiểm tra bàn này đã có order chưa
        List<Order> existingOrders = orderRepository.findByTable_TableId(orderRequest.getTableId());
        if (existingOrders != null && !existingOrders.isEmpty()) {
            throw new AppException(ErrorCode.TABLE_ALREADY_HAS_ORDER);
        }

        // Tính tiền
        float subTotal = 0;
        List<DetailOrder> detailOrders = new ArrayList<>();

        for (DetailOrderRequest detailOrderRequest : orderRequest.getDetailOrders()) {
            // Kiểm tra item
            Item item = itemRepository.findById(detailOrderRequest.getItemId())
                    .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

            double itemPrice = item.getPrice();
            double itemTotal = itemPrice * detailOrderRequest.getQuantity();

            List<ModifierOption> modifierOptions = new ArrayList<>();
            if (detailOrderRequest.getModifierOptionIds() != null && !detailOrderRequest.getModifierOptionIds().isEmpty()) {
                modifierOptions = modifierOptionRepository.findAllById(detailOrderRequest.getModifierOptionIds());

                List<ModifierGroup> itemModifierGroups = item.getModifierGroups();

                for (ModifierOption modifier : modifierOptions) {
                    boolean isValidModifier = itemModifierGroups.stream()
                            .anyMatch(group -> group.getOptions() != null &&
                                    group.getOptions().contains(modifier));

                    if (!isValidModifier) {
                        throw new AppException(ErrorCode.MODIFIER_NOT_VALID_FOR_ITEM);
                    }

                    itemTotal += modifier.getPrice();
                }
            }

            subTotal += itemTotal;

            DetailOrder detailOrder = detailOrderMapper.toDetailOrder(detailOrderRequest);
            detailOrder.setItem(item);
            detailOrder.setPrice(itemPrice);
            detailOrder.setModifies(modifierOptions);
            detailOrders.add(detailOrder);
        }

        // Lưu order
        Order order = orderMapper.toOrder(orderRequest);
        OrderStatus pendingStatusEnum = OrderStatus.valueOf("Pending_approval"); // Hoặc OrderStatus.PENDING_APPROVAL

        Status pendingStatus = statusRepository.findByOrderStatus(pendingStatusEnum)
                .orElseThrow(() -> new RuntimeException("Status not found"));

        order.setStatus(pendingStatus);
        order.setIsHaveName(isHaveName);
        order.setCustomerName(customerName);
        order.setTable(restaurantTable);
        order.setCustomer(customer);

        System.out.println("📝 Lưu order - isHaveName: " + isHaveName + ", customerName: " + customerName
                + ", customerId: " + (customer != null ? customer.getCustomerId() : "null"));

        Order savedOrder = orderRepository.save(order);

        // Lưu detailOrder
        for (DetailOrder detail : detailOrders) {
            detail.setOrder(savedOrder);
        }
        detailOrderRepository.saveAll(detailOrders);

        // Cập nhật quantity_sold của item
        for (DetailOrderRequest detailOrderRequest : orderRequest.getDetailOrders()) {
            Item item = itemRepository.findById(detailOrderRequest.getItemId()).orElse(null);
            if (item != null) {
                item.setQuantitySold((item.getQuantitySold() != null ? item.getQuantitySold() : 0) + detailOrderRequest.getQuantity());
                itemRepository.save(item);
            }
        }

        // Tạo response
        OrderResponse response = orderMapper.toOrderResponse(savedOrder);
        response.setSubtotal(subTotal);
        response.setOderStatus(savedOrder.getStatus().getOrderStatus());
        response.setCustomerName(savedOrder.getCustomerName());
        response.setTableId(savedOrder.getTable().getTableId());
        response.setDetailOrders(toDetailOrderResponses(detailOrders));

        return response;
    }

    @Override
    public List<OrderResponse> getAllMyOrder(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();
        // lay account tu username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        Integer accountId = account.getAccountId();

        // Tim customer boi account
        Customer customer = customerRepository.findByAccountAccountId(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        Integer customerId = customer.getCustomerId();


        // Lấy tất cả order
        List<Order> orders = orderRepository.findByCustomerCustomerId(customerId);

        // Convert sang OrderResponse dùng mapper
        return orders.stream()
                .filter(order -> !"Deleted".equals(order.getStatus().getOrderStatus()))
                .map(this::toFullOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllTenantOrder(JwtAuthenticationToken jwtAuthenticationToken) {
        // Nhà hang dăng nhap
        String username = jwtAuthenticationToken.getName();
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        List<Order> orders = orderRepository.findByTableTenantTenantId(tenantId);
        return orders.stream()
                .map(this::toFullOrderResponse)
                .collect(Collectors.toList());


    }

    private OrderResponse toFullOrderResponse(Order order) {
        OrderResponse response = orderMapper.toOrderResponse(order);

        // Set tableId (vì mapper cơ bản có thể không map trường này)
        if (order.getTable() != null) {
            response.setTableId(order.getTable().getTableId());
        }
        response.setOderStatus(order.getStatus().getOrderStatus());

        // Map chi tiết đơn hàng với đầy đủ thông tin item và modifier
        List<DetailOrderResponse> detailResponses = order.getDetailOrders().stream()
                .map(detail -> {
                    DetailOrderResponse detailResponse = detailOrderMapper.toDetailOrderResponse(detail);

                    // Thêm thông tin item
                    if (detail.getItem() != null) {
                        detailResponse.setItemId(detail.getItem().getItemId());
                        detailResponse.setItemName(detail.getItem().getItemName());
                    }

                    // Map modifiers chi tiết (vì mapper mặc định có thể không làm phần này)
                    List<ModifierOptionResponse> modifierResponses = detail.getModifies().stream()
                            .map(m -> {
                                ModifierOptionResponse modResp = new ModifierOptionResponse();
                                modResp.setModifierOptionId(m.getModifierOptionId());
                                modResp.setName(m.getName());
                                modResp.setPrice(m.getPrice());
                                modResp.setModifierGroupId(m.getModifierGroup().getModifierGroupId());
                                modResp.setModifierGroupName(m.getModifierGroup().getName());
                                return modResp;
                            })
                            .collect(Collectors.toList());

                    detailResponse.setModifiers(modifierResponses);
                    return detailResponse;
                })
                .collect(Collectors.toList());

        response.setDetailOrders(detailResponses);

        return response;
    }

    private List<DetailOrderResponse> toDetailOrderResponses(List<DetailOrder> detailOrders) {
        return detailOrders.stream()
                .map(detail -> {
                    DetailOrderResponse detailResponse = detailOrderMapper.toDetailOrderResponse(detail);

                    if (detail.getItem() != null) {
                        detailResponse.setItemId(detail.getItem().getItemId());
                        detailResponse.setItemName(detail.getItem().getItemName());
                    }

                    detailResponse.setModifiers(detail.getModifies().stream()
                            .map(m -> new ModifierOptionResponse(
                                    m.getModifierOptionId(),
                                    m.getName(),
                                    m.getPrice(),
                                    m.getModifierGroup().getModifierGroupId(),
                                    m.getModifierGroup().getName()
                            ))
                            .collect(Collectors.toList()));

                    return detailResponse;
                })
                .collect(Collectors.toList());
    }
}
