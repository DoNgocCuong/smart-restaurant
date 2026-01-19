package com.smart_restaurant.demo.Service.Impl;


import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.smart_restaurant.demo.Repository.DiscountRepository;
import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Repository.StatusRepository;
import com.smart_restaurant.demo.Repository.*;
import com.smart_restaurant.demo.Service.AccountService;
import com.smart_restaurant.demo.Service.OrderService;
import com.smart_restaurant.demo.dto.Request.*;
import com.smart_restaurant.demo.dto.Response.*;
import com.smart_restaurant.demo.entity.Discount;
import com.smart_restaurant.demo.entity.Order;
import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.enums.*;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import com.smart_restaurant.demo.mapper.OrderMapper;
import com.smart_restaurant.demo.entity.*;
import com.smart_restaurant.demo.enums.OrderStatus;

import com.smart_restaurant.demo.mapper.DetailOrderMapper;


import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;


import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;
import java.util.*;

import java.util.stream.Collectors;

import static com.smart_restaurant.demo.enums.StatusTable.occupied;


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
    EmployeeRepository employeeRepository;
    NotificationService notificationService;

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
        String username = jwtAuthenticationToken.getName();

        if (username == null || username.isEmpty()) {
            System.out.println("⚠️ ERROR: Username từ JWT là null hoặc rỗng!");
            throw new AppException(ErrorCode.INVALID_TOKEN_FORMAT);
        }

        // Tìm Account bằng username
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        String customerName = null;
        Customer customer = null;
        boolean isHaveName = false;

        // ===== KIỂM TRA NẾU LÀ ACCOUNT MÃNG LAI =====
        if (username.contains("guest_tenant")) {
            System.out.println("🏪 Account mãng lai - Lấy customerName từ request");

            customerName = orderRequest.getCustomerName();
            isHaveName = true;

            // Kiểm tra phone tồn tại
            Optional<Customer> existingCustomer = customerRepository.findByPhone(orderRequest.getPhone());
            if (existingCustomer.isPresent()) {
                throw new AppException(ErrorCode.PHONE_EXISTED);
            }

            // Tạo customer mới cho account mãng lai
            customer = Customer.builder()
                    .name(customerName)
                    .phone(orderRequest.getPhone())
                    .address(null)
                    .gender(null)
                    .account(null)
                    .build();

            customer = customerRepository.save(customer);
            System.out.println("✅ Tạo khách hàng mới - CustomerName: " + customerName);

        } else {
            // ===== ACCOUNT THỰC TẾ =====
            System.out.println("👤 Account thực - Lấy customerName từ DB");

            isHaveName = false;

            // Tìm Customer bằng Account ID
            customer = customerRepository.findByAccountAccountId(account.getAccountId())
                    .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

            // Lấy tên từ Customer
            customerName = customer.getName();

            System.out.println("✅ CustomerId: " + customer.getCustomerId());
            System.out.println("✅ CustomerName từ DB: " + customerName);
        }


        // Lấy bàn
        RestaurantTable restaurantTable = tableRepository.findById(orderRequest.getTableId())
                .orElseThrow(() -> new AppException(ErrorCode.TABLE_NOT_FOUND));


        boolean exists = orderRepository.existsByTable_TableIdAndStatus_OrderStatusNotIn(
                orderRequest.getTableId(),
                List.of(OrderStatus.Rejected, OrderStatus.Paid)
        );

        if (exists) {
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

                // Validate modifiers theo ModifierGroup rules
                validateModifiersForItem(modifierOptions, itemModifierGroups);

                for (ModifierOption modifier : modifierOptions) {
                    itemTotal += modifier.getPrice()* detailOrderRequest.getQuantity();
                }
            } else {
                // Check nếu có required modifier groups nhưng không chọn
                validateRequiredModifierGroups(item.getModifierGroups());
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
        OrderStatus pendingStatusEnum = OrderStatus.valueOf("Pending_approval");

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
        restaurantTable.setStatusTable(StatusTable.occupied);
        // ================== SEND SOCKET NOTIFICATION ==================
        OrderNotification noti = new OrderNotification(
                savedOrder.getOrderId(),
                restaurantTable.getTableId(),
                "🔔 Có đơn hàng mới tại bàn " + restaurantTable.getTableId()
        );

        notificationService.notifyNewOrder(noti);
// =============================================================


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
        response.setCustomerId(savedOrder.getCustomer().getCustomerId());
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
                .filter(order -> !"Rejected".equals(order.getStatus().getOrderStatus()))
                .map(this::toFullOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllTenantOrder(JwtAuthenticationToken jwtAuthenticationToken) {

        String username = jwtAuthenticationToken.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.getTenant() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Chặn CUSTOMER hoặc SUPER_ADMIN
        }
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        List<Order> orders = orderRepository.findByTableTenantTenantId(tenantId);
        return orders.stream()
                .map(this::toFullOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(Integer id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        if ("Rejected".equals(order.getStatus().getOrderStatus())) {
            throw new RuntimeException("Order đã bị xóa");
        }

        return toFullOrderResponse(order);

    }

    @Override
    public List<OrderResponse> getAllOrderTenantStatusPendingApproval(JwtAuthenticationToken jwtToken) {
        String username = jwtToken.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        if (account.getTenant() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Chặn CUSTOMER hoặc SUPER_ADMIN
        }
        Integer tenantId = accountService.getTenantIdByUsername(username);
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(ErrorCode.TENANT_NOT_FOUND));

        List<Order> orders = orderRepository.findByTable_Tenant_TenantIdAndStatus_OrderStatus(tenantId, OrderStatus.Pending_approval);
        return orders.stream()
                .map(this::toFullOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Order getOrderEntityById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        if ("Rejected".equals(order.getStatus().getOrderStatus())) {
            throw new RuntimeException("Order đã bị xóa");
        }
        return order;
    }

    @Override
    public List<OrderResponse> getAllOrderTenantStatusPendingApprovalByStaff(JwtAuthenticationToken jwtToken) {
        String username = jwtToken.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        if (account.getTenant() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Chặn CUSTOMER hoặc SUPER_ADMIN
        }
        Integer tenantId = accountService.getTenantIdByUsername(username);

        Employee employee = employeeRepository.findByAccount_AccountId(account.getAccountId())
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        // Lấy các bàn mà staff quản trị
        List<RestaurantTable> staffTables = employee.getRestaurantTables();

        if (staffTables == null || staffTables.isEmpty()) {
            return List.of(); // Không có bàn nào
        }

        // Lấy danh sách tableId
        List<Integer> tableIds = staffTables.stream()
                .map(RestaurantTable::getTableId)
                .collect(Collectors.toList());

        // Query Orders từ các bàn đó
        List<Order> orders = orderRepository.findByTable_Tenant_TenantIdAndTable_TableIdInAndStatus_OrderStatus(tenantId, tableIds ,OrderStatus.Pending_approval);
        return orders.stream()
                .map(this::toFullOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllTenantOrderByStaff(JwtAuthenticationToken jwtAuthenticationToken) {

        String username = jwtAuthenticationToken.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.getTenant() == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Chặn CUSTOMER hoặc SUPER_ADMIN
        }
        Integer tenantId = accountService.getTenantIdByUsername(username);


        Employee employee = employeeRepository.findByAccount_AccountId(account.getAccountId())
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        // [1] Lấy các bàn mà staff quản trị
        List<RestaurantTable> staffTables = employee.getRestaurantTables();

        if (staffTables == null || staffTables.isEmpty()) {
            return List.of(); // Không có bàn nào
        }

        //[2] Lấy danh sách tableId từ cái list bàn
        List<Integer> tableIds = staffTables.stream()
                .map(RestaurantTable::getTableId)
                .collect(Collectors.toList());

        // [3] Tìm Orders từ các bàn đó ma nhan vien do quan tri
        List<Order> orders = orderRepository.findByTable_Tenant_TenantIdAndTable_TableIdIn(tenantId, tableIds);


        return orders.stream()
                .map(this::toFullOrderResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    @Override
    public OrderResponse updateOrderStatus(Integer id, UpdateOrderStatusRequest updateOrderStatusRequest) {

        // Check order tồn tại
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Check request
        if (updateOrderStatusRequest == null || updateOrderStatusRequest.getStatus() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }




        // Map enum → entity Status
        Status statusEntity = statusRepository
                .findByOrderStatus(updateOrderStatusRequest.getStatus())
                .orElseThrow(() -> new AppException(ErrorCode.STATUS_NOT_FOUND));



        order.setStatus(statusEntity);
        // Nếu status là Approved thì duyệt tất cả detail orders
        if (OrderStatus.Approved.equals(updateOrderStatusRequest.getStatus())) {
            if (order.getDetailOrders() != null && !order.getDetailOrders().isEmpty()) {
                order.getDetailOrders().forEach(detailOrder -> {
                    detailOrder.setIsApproved(true);
                    detailOrderRepository.save(detailOrder);
                });
            }
        }

        // Nếu status là Rejected thì chuyển statusTable về unoccupied
        if (OrderStatus.Rejected.equals(updateOrderStatusRequest.getStatus())) {
            RestaurantTable table = order.getTable();
            if (table != null) {
                table.setStatusTable(StatusTable.unoccupied);
                tableRepository.save(table);
                System.out.println("🔄 Bàn " + table.getTableId() + " chuyển về unoccupied");
            }
        }


        // Save
        Order updatedOrder = orderRepository.save(order);

        String newStatus=statusEntity.getOrderStatus().toString();
        OrderNotification orderNotification=OrderNotification.builder()
                .orderId(id)
                .tableId(order.getTable().getTableId())
                .build();
        switch (newStatus) {

            case "Approved" -> {
                // Thông báo cho customer: đơn đã được duyệt
                orderNotification.setMessage("Đơn hàng của bạn đã được phê duyệt.");
                notificationService.notifyAcceptOrderCustomer(orderNotification);

                // Thông báo cho kitchen: có đơn mới
                orderNotification.setMessage("Có đơn hàng mới.");
                notificationService.notifyAcceptOrderKitchen(orderNotification);
            }

            case "Rejected" -> {
                // Thông báo cho customer: đơn không được chấp nhận
                orderNotification.setMessage("Đơn hàng của bạn không được phê duyệt.Nhân viên của chúng tôi sẽ đến giải đáp trong giây lát.");
                notificationService.notifyAcceptOrderCustomer(orderNotification);
            }

            case "Cooking" -> {
                // Thông báo cho customer: đơn đang được nấu
                orderNotification.setMessage("Đơn hàng của bạn đang được nấu.");
                notificationService.notifyAcceptOrderCustomer(orderNotification);
            }

            case "Cooked" -> {
                // Thông báo cho employee: đơn sẵn sàng phục vụ
                orderNotification.setMessage("Đơn hàng đã được nấu xong.Nhanh chóng phục vụ khách hàng.");
                notificationService.notifyNewOrder(orderNotification);

                // Thông báo cho customer: món đã nấu xong
                orderNotification.setMessage("Đơn hàng của bạn đã được nấu xong, nhân viên của chúng tôi sẽ phục vụ bạn trong giây lát.");
                notificationService.notifyAcceptOrderCustomer(orderNotification);
            }

            case "Pending_approval" -> {
                orderNotification.setMessage("khách hàng yêu cầu thanh toán.");
                notificationService.notifyNewOrder(orderNotification);
            }

            case "Pending_payment" -> {
                orderNotification.setMessage("Bạn đã thanh toán thành công.");
                notificationService.notifyAcceptOrderCustomer(orderNotification);
                orderNotification.setMessage("Khách hàng yêu cầu thanh toán.");
                notificationService.notifyNewOrder(orderNotification);
            }
            case "Serving"->{
                orderNotification.setMessage("Đơn hàng đã được phục vụ");
                notificationService.notifyAcceptOrderCustomer(orderNotification);
            }
            default -> {
            }
        }
        return toFullOrderResponse(updatedOrder);
    }
    @Transactional
    @Override
    public OrderResponse updateOrderAddItems(Integer orderId, List<UpdateDetailOrderRequest> detailOrderRequests, JwtAuthenticationToken jwtAuthenticationToken) {
        // 1. Lấy Customer từ JWT
        String username = null;
        Customer customer = null;

        if (jwtAuthenticationToken != null) {
            username = jwtAuthenticationToken.getName();
            if (username == null || username.isEmpty()) {
                throw new AppException(ErrorCode.INVALID_TOKEN_FORMAT);
            }

            Account account = accountRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

            customer = customerRepository.findByAccountAccountId(account.getAccountId())
                    .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        }

        // 2. Kiểm tra order tồn tại
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // 3. Validate: Order phải thuộc về customer hiện tại (nếu đã đăng nhập)
        if (customer != null && !order.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ORDER_ACCESS);
        }

        // 4. Validate: Order KHÔNG được ở trạng thái Pending_payment, Paid, Pending_approval
        OrderStatus currentStatus = order.getStatus().getOrderStatus();
        if (OrderStatus.Pending_payment.equals(currentStatus) ||
                OrderStatus.Paid.equals(currentStatus) ||
                OrderStatus.Pending_approval.equals(currentStatus)) {
            throw new AppException(ErrorCode.INVALID_ORDER_STATUS);
        }

        // 5. Validate: Bàn vẫn hoạt động (không bị xóa/khóa)
        RestaurantTable table = order.getTable();
        if (!table.getIs_active()) {
            throw new AppException(ErrorCode.TABLE_NOT_AVAILABLE);
        }

        // 6. Xử lý các mặt hàng - CHỈ THÊM MỚI
        List<DetailOrder> newDetailOrders = new ArrayList<>();

        for (UpdateDetailOrderRequest detailOrderRequest : detailOrderRequests) {

            // 6.1. Validate request
            if (detailOrderRequest.getItemId() == null || detailOrderRequest.getQuantity() == null) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            // 6.2. Kiểm tra quantity > 0
            if (detailOrderRequest.getQuantity() <= 0) {
                throw new AppException(ErrorCode.CANNOT_DECREASE_QUANTITY);
            }

            // 6.3. Kiểm tra item tồn tại
            Item item = itemRepository.findById(detailOrderRequest.getItemId())
                    .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

            double itemPrice = item.getPrice();

            // 6.4. Validate & lấy modifiers
            List<ModifierOption> requestModifiers = new ArrayList<>();
            if (detailOrderRequest.getModifierOptionIds() != null && !detailOrderRequest.getModifierOptionIds().isEmpty()) {
                requestModifiers = modifierOptionRepository.findAllById(detailOrderRequest.getModifierOptionIds());

                // Validate số lượng modifier tìm được
                if (requestModifiers.size() != detailOrderRequest.getModifierOptionIds().size()) {
                    throw new AppException(ErrorCode.MODIFIER_NOT_FOUND);
                }

                // Validate modifiers hợp lệ với item
                List<ModifierGroup> itemModifierGroups = item.getModifierGroups();
                validateModifiersForItem(requestModifiers, itemModifierGroups);
            } else {
                // Validate item có yêu cầu modifier bắt buộc không
                validateRequiredModifierGroups(item.getModifierGroups());
            }

            // 6.5. Tạo DetailOrder mới
            DetailOrder detailOrder = new DetailOrder();
            detailOrder.setItem(item);
            detailOrder.setPrice(itemPrice);
            detailOrder.setQuantity(detailOrderRequest.getQuantity());
            detailOrder.setModifies(requestModifiers);
            detailOrder.setOrder(order);

            // ✅ Detail mới luôn chờ duyệt
            detailOrder.setIsApproved(false);

            newDetailOrders.add(detailOrder);

            System.out.println("✨ Thêm mới DetailOrder: Item " + item.getItemId() +
                    ", qty " + detailOrderRequest.getQuantity() +
                    ", modifiers " + requestModifiers.size() +
                    ", isApproved: false (chờ duyệt)");
        }



        // 9. Lưu các DetailOrder mới và cập nhật
        if (!newDetailOrders.isEmpty()) {
            detailOrderRepository.saveAll(newDetailOrders);
            System.out.println("💾 Đã lưu " + newDetailOrders.size() + " DetailOrder mới");
        }


        // 11. Cập nhật order
        order.setUpdateAt(LocalDateTime.now());

        // 12. Lấy toàn bộ DetailOrders của order (cả cũ + mới)
        List<DetailOrder> allDetailOrders = detailOrderRepository.findByOrder_OrderId(orderId);

        // 12. TÍNH subtotal - CHỈ TÍNH DETAIL ĐÃ DUYỆT (isApproved = true)
        float totalSubtotal = 0;
        int approvedCount = 0;

        for (DetailOrder detail : allDetailOrders) {
            // ✅ CHỈ TÍNH detail đã duyệt
            if (detail.getIsApproved() == null || !detail.getIsApproved()) {
                continue;  // Bỏ qua detail chưa duyệt
            }

            approvedCount++;
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

        // 14. Tạo response
        OrderResponse response = orderMapper.toOrderResponse(updatedOrder);
        response.setSubtotal(totalSubtotal);
        response.setOderStatus(updatedOrder.getStatus().getOrderStatus());
        response.setCustomerName(updatedOrder.getCustomerName());
        response.setDetailOrders(allDetailOrders.stream()
                .map(detailOrderMapper::toDetailOrderResponse)
                .collect(Collectors.toList()));

        System.out.println("✅ Thêm " + newDetailOrders.size() + " DetailOrder vào order " + orderId);
        OrderNotification orderNotification=OrderNotification.builder()
                .orderId(orderId)
                .tableId(order.getTable().getTableId())
                .message("Khách yêu cầu thêm món ăn cho đơn hàng.")
                .build();
        notificationService.notifyNewOrder(orderNotification);
        return response;
    }


    private OrderResponse toFullOrderResponse(Order order) {
        OrderResponse response = orderMapper.toOrderResponse(order);
        response.setCustomerName(order.getCustomerName());
        // ✅ Set customerId
        if (order.getCustomer() != null) {
            response.setCustomerId(order.getCustomer().getCustomerId());
        }

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

    private List<DetailOrderResponse>toDetailOrderResponses(List<DetailOrder> detailOrders) {
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
                                    m.getIsActive(),
                                    m.getModifierGroup().getModifierGroupId(),
                                    m.getModifierGroup().getName()
                            ))
                            .collect(Collectors.toList()));

                    return detailResponse;
                })
                .collect(Collectors.toList());
    }

    @Override
    public byte[] generateInvoicePdf(Integer orderId, JwtAuthenticationToken jwtAuthenticationToken) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_EXISTED));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // ===== TITLE (GIỮ NGUYÊN FONT) =====
            com.lowagie.text.Font titleFont =
                    new com.lowagie.text.Font(
                            com.lowagie.text.Font.HELVETICA,
                            18,
                            com.lowagie.text.Font.BOLD
                    );


            Paragraph title = new Paragraph(
                    "SMART RESTAURANT\nHÓA ĐƠN THANH TOÁN",
                    titleFont
            );
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(15);
            document.add(title);

            // ===== INFO (GIỮ NGUYÊN FONT) =====
            com.lowagie.text.Font normalFont =
                    new com.lowagie.text.Font(
                            com.lowagie.text.Font.HELVETICA,
                            10,
                            com.lowagie.text.Font.BOLD
                    );

            document.add(new Paragraph("Mã đơn: " + order.getOrderId(), normalFont));
            document.add(new Paragraph("Bàn: " + order.getTable().getTableName(), normalFont));

            String customerName = Boolean.TRUE.equals(order.getIsHaveName())
                    ? order.getCustomerName()
                    : order.getCustomer().getName();

            document.add(new Paragraph("Khách hàng: " + customerName, normalFont));
            document.add(new Paragraph("Ngày: " + order.getCreateAt(), normalFont));
            document.add(Chunk.NEWLINE);

            // ===== TABLE (7 CỘT) =====
            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setWidths(new float[]{3, 1, 2, 2, 2, 2, 2});

            // ===== HEADER =====
            table.addCell(createHeaderCell("Món"));
            table.addCell(createHeaderCell("SL"));
            table.addCell(createHeaderCell("Giá"));
            table.addCell(createHeaderCell("Loại"));
            table.addCell(createHeaderCell("size"));
            table.addCell(createHeaderCell("Giá mod"));
            table.addCell(createHeaderCell("Thành tiền"));

            // ===== DATA =====
            for (DetailOrder d : order.getDetailOrders()) {
                double modifierTotal=0;

                if (d.getModifies() == null || d.getModifies().isEmpty()) {
                    table.addCell(createCell(d.getItem().getItemName()));
                    table.addCell(createCenterCell(String.valueOf(d.getQuantity())));
                    table.addCell(createRightCell(formatMoney(d.getPrice())));

                    table.addCell(createCell("-"));
                    table.addCell(createCell("-"));
                    table.addCell(createRightCell("-"));
                    double lineTotal = d.getQuantity() * d.getPrice();
                    table.addCell(createRightCell(formatMoney(lineTotal)));
                } else {

                    for (ModifierOption m : d.getModifies()) {

                        table.addCell(createCell(d.getItem().getItemName()));
                        table.addCell(createCenterCell(String.valueOf(d.getQuantity())));
                        table.addCell(createRightCell(formatMoney(d.getPrice())));

                        table.addCell(createCell(m.getModifierGroup().getName()));
                        table.addCell(createCell(m.getName()));
                        table.addCell(createRightCell(formatMoney(m.getPrice())));
                        modifierTotal+=m.getPrice();
                    }
                    double lineTotal = d.getQuantity() * d.getPrice()+modifierTotal;
                    table.addCell(createRightCell(formatMoney(lineTotal)));
                }
            }

            document.add(table);
            document.add(Chunk.NEWLINE);

            // ===== TOTAL =====
            document.add(new Paragraph("Tạm tính: " + formatMoney(order.getSubtotal()), normalFont));
            document.add(new Paragraph("Giảm giá: -" + formatMoney(order.getDiscount()), normalFont));

            double taxAmount = order.getTotal() - (order.getSubtotal() - order.getDiscount());
            document.add(new Paragraph(
                    "Thuế (" + order.getTax() + "%): " + formatMoney(taxAmount),
                    normalFont
            ));

            com.lowagie.text.Font totalFont =
                    new com.lowagie.text.Font(
                            com.lowagie.text.Font.HELVETICA,
                            12,
                            com.lowagie.text.Font.BOLD
                    );

            Paragraph total = new Paragraph(
                    "TỔNG THANH TOÁN: " + formatMoney(order.getTotal()),
                    totalFont
            );
            total.setSpacingBefore(10);
            document.add(total);

            Paragraph thanks = new Paragraph("\nCảm ơn quý khách!", normalFont);
            thanks.setAlignment(Element.ALIGN_CENTER);
            document.add(thanks);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo PDF hóa đơn", e);
        } finally {
            document.close();
        }

        return out.toByteArray();
    }

    // ================= HELPER =================

    private PdfPCell createCell(String content) {
        com.lowagie.text.Font font = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 10, com.lowagie.text.Font.BOLD);
        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setPadding(2);
        return cell;
    }

    private PdfPCell createHeaderCell(String content) {
        com.lowagie.text.Font font = new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 12, com.lowagie.text.Font.BOLD);
        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setPadding(2);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

    private PdfPCell createRightCell(String content) {
        PdfPCell cell = createCell(content);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        return cell;
    }

    private PdfPCell createCenterCell(String content) {
        PdfPCell cell = createCell(content);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

    private String formatMoney(Double value) {
        if (value == null) value = 0d;
        return String.format("%,.0f VNĐ", value);
    }

    private String formatMoney(Float value) {
        if (value == null) value = 0f;
        return String.format("%,.0f VNĐ", value);
    }

    private void validateModifiersForItem(List<ModifierOption> modifierOptions, List<ModifierGroup> itemModifierGroups) {

        Map<ModifierGroup, List<ModifierOption>> modifiersByGroup = new HashMap<>();

        // Check modifier group có thuộc Item không
        for (ModifierOption modifier : modifierOptions) {
            ModifierGroup group = modifier.getModifierGroup();
            if (!itemModifierGroups.contains(group)) {
                throw new AppException(ErrorCode.MODIFIER_NOT_VALID_FOR_ITEM);
            }
            modifiersByGroup.computeIfAbsent(group, k -> new ArrayList<>()).add(modifier);
        }

        // Validate constraints của từng group
        for (ModifierGroup group : itemModifierGroups) {
            List<ModifierOption> selectedModifiers = modifiersByGroup.getOrDefault(group, new ArrayList<>());

            // Check isRequired
            if (Boolean.TRUE.equals(group.getIsRequired()) && selectedModifiers.isEmpty()) {
                throw new AppException(ErrorCode.REQUIRED_MODIFIER_GROUP_NOT_SELECTED);
            }

            // Check selectionType
            if (selectedModifiers.size() > 1) {
                if (group.getSelectionType() == SelectionType.SINGLE) {
                    throw new AppException(ErrorCode.MODIFIER_GROUP_ONLY_SINGLE_SELECTION);
                }
            }

            if (selectedModifiers.size() == 0 && group.getSelectionType() == SelectionType.SINGLE && Boolean.TRUE.equals(group.getIsRequired())) {
                throw new AppException(ErrorCode.REQUIRED_MODIFIER_GROUP_NOT_SELECTED);
            }
        }
    }

    private void validateRequiredModifierGroups(List<ModifierGroup> modifierGroups) {
        for (ModifierGroup group : modifierGroups) {
            if (Boolean.TRUE.equals(group.getIsRequired())) {
                throw new AppException(ErrorCode.REQUIRED_MODIFIER_GROUP_NOT_SELECTED);
            }
        }
    }

}
