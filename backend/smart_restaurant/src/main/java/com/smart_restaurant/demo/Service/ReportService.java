package com.smart_restaurant.demo.Service;

import com.smart_restaurant.demo.dto.Response.BestSellerRevenueResponse;
import com.smart_restaurant.demo.dto.Response.RevenueReportResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    List<RevenueReportResponse> byDateRange(LocalDate from, LocalDate to);
    List<RevenueReportResponse> byWeekRange(int year, int fromMonth, int toMonth);
    List<RevenueReportResponse> byMonthRange(int fromYear, int toYear);

    List<BestSellerRevenueResponse> byDayItem(LocalDate from, LocalDate to);
    List<BestSellerRevenueResponse> byWeekItem(int year, int fromMonth, int toMonth);
    List<BestSellerRevenueResponse> byMonthItem(int fromYear, int toYear);
}
