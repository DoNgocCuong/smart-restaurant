package com.smart_restaurant.demo.Controller;

import com.smart_restaurant.demo.Service.ReportService;
import com.smart_restaurant.demo.dto.Response.ApiResponse;
import com.smart_restaurant.demo.dto.Response.BestSellerRevenueResponse;
import com.smart_restaurant.demo.dto.Response.RevenueReportResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports/revenue")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/daily")
    public ApiResponse<List<RevenueReportResponse>> byDay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.<List<RevenueReportResponse>>builder()
                .result(reportService.byDateRange(from, to))
                .build();
    }

    @GetMapping("/weekly")
    public ApiResponse<List<RevenueReportResponse>> byWeek(
            @RequestParam int year,
            @RequestParam int fromMonth,
            @RequestParam int toMonth) {
        return ApiResponse.<List<RevenueReportResponse>>builder()
                .result(reportService.byWeekRange(year, fromMonth, toMonth))
                .build();
    }

    @GetMapping("/monthly")
    public ApiResponse<List<RevenueReportResponse>> byMonth(
            @RequestParam int fromYear,
            @RequestParam int toYear) {
        return ApiResponse.<List<RevenueReportResponse>>builder()
                .result(reportService.byMonthRange(fromYear, toYear))
                .build();
    }

    @GetMapping("/daily/items")
    public ApiResponse<List<BestSellerRevenueResponse>> byDayItem(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.<List<BestSellerRevenueResponse>>builder()
                .result(reportService.byDayItem(from, to))
                .build();
    }

    @GetMapping("/weekly/items")
    public ApiResponse<List<BestSellerRevenueResponse>> byWeekItem(
            @RequestParam int year,
            @RequestParam int fromMonth,
            @RequestParam int toMonth) {
        return ApiResponse.<List<BestSellerRevenueResponse>>builder()
                .result(reportService.byWeekItem(year, fromMonth, toMonth))
                .build();
    }

    @GetMapping("/monthly/items")
    public ApiResponse<List<BestSellerRevenueResponse>> byMonthItem(
            @RequestParam int fromYear,
            @RequestParam int toYear) {
        return ApiResponse.<List<BestSellerRevenueResponse>>builder()
                .result(reportService.byMonthItem(fromYear, toYear))
                .build();
    }
}
