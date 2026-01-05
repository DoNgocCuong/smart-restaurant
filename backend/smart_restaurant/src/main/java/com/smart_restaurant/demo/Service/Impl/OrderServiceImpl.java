package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.DiscountRepository;
import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Repository.StatusRepository;
import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.AccountService;
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
import com.smart_restaurant.demo.dto.Request.DetailOrderRequest;
import com.smart_restaurant.demo.dto.Request.OrderRequest;
import com.smart_restaurant.demo.dto.Response.DetailOrderResponse;
import com.smart_restaurant.demo.dto.Response.ModifierOptionResponse;
import com.smart_restaurant.demo.dto.Response.OrderResponse;
import com.smart_restaurant.demo.entity.*;
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

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
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
    DiscountRepository discountRepository;
    OrderRepository orderRepository;
    @Override
    public InvoiceResponse createInvoice(Integer orderId ,JwtAuthenticationToken jwtAuthenticationToken){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        List<Discount> discountList = discountRepository.findAll();

        Discount discountApply = null;
        Account account=accountRepository.findByUsername(jwtAuthenticationToken.getName()).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_EXISTED));
        Tenant tenant=account.getTenant();
        for (Discount discount : discountList) {
            if (discount.getMinApply() <= order.getSubtotal()
                    && discount.getMaxApply() >= order.getSubtotal()
                    && Boolean.TRUE.equals(discount.getIsActive())
                    &&discount.getTenant()==tenant) {
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
        order.setDiscount(discountAmount);
        Status status=order.getStatus();
        status.setOrderStatus(OrderStatus.Pending_payment);
        statusRepository.save(status);
        InvoiceResponse invoiceResponse=orderMapper.toInvoiceResponse(orderRepository.save(order));
        invoiceResponse.setTableName(order.getTable().getTableName());
        invoiceResponse.setDetailOrders(toDetailOrderResponses(order.getDetailOrders()));
        System.out.println("name:"+ order.getCustomerName());
        if(order.getIsHaveName()==true){
            invoiceResponse.setCustomerName(order.getCustomerName());
        }else {
            invoiceResponse.setCustomerName(order.getCustomer().getName());
        }
        return invoiceResponse;
    }


    @Override
    public OrderResponse createOrder(OrderRequest orderRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        String username = null;
        Integer customerId = null;

        // Check no dang nhap hay khong
        if (jwtAuthenticationToken != null) {
            username = jwtAuthenticationToken.getName();
            Customer customer = customerRepository.findByAccount_Username(username).orElse(null);
            if (customer != null) {
                customerId = customer.getCustomerId();
            }
        }

        // Lấy bàn
        RestaurantTable restaurantTable = tableRepository.findById(orderRequest.getTableId())
                .orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_FOUND));

        // Tính tiền
        float subTotal = 0;
        List<DetailOrder> detailOrders = new ArrayList<>();

        for(DetailOrderRequest detailOrderRequest :orderRequest.getDetailOrders())
        {

            // Kiểm tra item
            Item item = itemRepository.findById(detailOrderRequest.getItemId())
                    .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

            double itemPrice = item.getPrice();

            List<ModifierOption> modifierOptions = new ArrayList<>();
            if (detailOrderRequest.getModifierOptionIds() != null && !detailOrderRequest.getModifierOptionIds().isEmpty())
            {
                modifierOptions = modifierOptionRepository.findAllById(detailOrderRequest.getModifierOptionIds());

                // Lấy danh sách modifierGroup của item
                List<ModifierGroup> itemModifierGroups = item.getModifierGroups();

                for (ModifierOption modifier : modifierOptions) {

                    // Kiểm tra modifier có thuộc modifierGroup nào của item không
                    boolean isValidModifier = itemModifierGroups.stream()
                            .anyMatch(group -> group.getOptions() != null &&
                                        group.getOptions().contains(modifier));

                    if (!isValidModifier) {
                        throw new AppException(ErrorCode.MODIFIER_NOT_VALID_FOR_ITEM);
                    }

                    itemPrice += modifier.getPrice();
                }
            }

            double itemTotal = itemPrice * detailOrderRequest.getQuantity();
            subTotal += itemTotal;

            DetailOrder detailOrder = detailOrderMapper.toDetailOrder(detailOrderRequest);
            detailOrder.setItem(item);
            detailOrder.setPrice(itemPrice);
            detailOrder.setModifies(modifierOptions);

            // thêm vào danh sách

            detailOrders.add(detailOrder);
        }

        // lưu order
        Order order = orderMapper.toOrder(orderRequest);
        order.setTable(restaurantTable);
        Order savedOrder = orderRepository.save(order);

        // lưu detailOrder trong cái danh sách
        for (DetailOrder detail : detailOrders) {
            detail.setOrder(savedOrder);
        }
        detailOrderRepository.saveAll(detailOrders);

        // Cập nhật quantity_sold của item ( ban duoc bao nhiu )
        for (DetailOrderRequest detailOrderRequest : orderRequest.getDetailOrders()) {
            Item item = itemRepository.findById(detailOrderRequest.getItemId()).orElse(null);
            if (item != null) {
                item.setQuantitySold((item.getQuantitySold() != null ? item.getQuantitySold() : 0) + detailOrderRequest.getQuantity());
                itemRepository.save(item);
            }
        }


        OrderResponse response = orderMapper.toOrderResponse(savedOrder);
        response.setSubtotal(subTotal);
        response.setCustomerName(savedOrder.getCustomerName());
        response.setTableId(savedOrder.getTable().getTableId());
        response.setDetailOrders(toDetailOrderResponses(detailOrders));

        return response;

    }

    @Override
    public List<OrderResponse> getAllOrder(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = null;

        if (jwtAuthenticationToken != null) {
            username = jwtAuthenticationToken.getName();
        }

        // Lấy tất cả order
        List<Order> orders = orderRepository.findAll();

        // Convert sang OrderResponse dùng mapper
        return orders.stream()
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
