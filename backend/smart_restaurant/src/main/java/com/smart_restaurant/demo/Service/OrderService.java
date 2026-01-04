package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.InvoiceResponse;

public interface OrderService {
    InvoiceResponse createInvoice(Integer orderId );
}
