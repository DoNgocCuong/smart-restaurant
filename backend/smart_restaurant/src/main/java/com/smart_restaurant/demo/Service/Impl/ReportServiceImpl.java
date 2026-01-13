package com.smart_restaurant.demo.Service.Impl;

import com.smart_restaurant.demo.Repository.DetailOrderRepository;
import com.smart_restaurant.demo.Repository.OrderRepository;
import com.smart_restaurant.demo.Repository.StatusRepository;
import com.smart_restaurant.demo.Service.ReportService;
import com.smart_restaurant.demo.dto.Response.BestSellerRevenueResponse;
import com.smart_restaurant.demo.dto.Response.RevenueReportResponse;
import com.smart_restaurant.demo.entity.Status;
import com.smart_restaurant.demo.enums.OrderStatus;
import com.smart_restaurant.demo.exception.AppException;
import com.smart_restaurant.demo.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReportServiceImpl implements ReportService {
    private final OrderRepository orderRepository;
    StatusRepository statusRepository;
    DetailOrderRepository repo;
    private static final OrderStatus VALID_STATUS = OrderStatus.Paid;

    // ===== 1. THEO NGÀY =====
    @Override
    public List<RevenueReportResponse> byDateRange(LocalDate from, LocalDate to) {
        Status status=statusRepository.findByOrderStatus(OrderStatus.Paid).orElseThrow(()->new AppException(ErrorCode.STATUS_NOT_FOUND));

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end   = to.atTime(23,59,59);

        return orderRepository.revenueByDateRange(start, end,status.getStatusId())
                .stream()
                .map(o -> new RevenueReportResponse(
                        o[0].toString(),                 // yyyy-MM-dd
                        ((Number) o[1]).doubleValue()
                ))
                .toList();
    }


    // ===== 2. THEO TUẦN (theo khoảng THÁNG) =====
    @Override
    public List<RevenueReportResponse> byWeekRange(int year,
                                                   int fromMonth,
                                                   int toMonth) {
        Status status=statusRepository.findByOrderStatus(OrderStatus.Paid).orElseThrow(()->new AppException(ErrorCode.STATUS_NOT_FOUND));

        return orderRepository.revenueByWeekInMonthRange(year, fromMonth, toMonth,status.getStatusId())
                .stream()
                .map(o -> {
                    int y = ((Number) o[0]).intValue();
                    int m = ((Number) o[1]).intValue();
                    int w = ((Number) o[2]).intValue();

                    return new RevenueReportResponse(
                            "Tuần " + w + " - Tháng " + m + "/" + y,
                            ((Number) o[3]).doubleValue()
                    );
                })
                .toList();
    }


    // ===== 3. THEO THÁNG (theo khoảng NĂM) =====
    @Override
    public List<RevenueReportResponse> byMonthRange(int fromYear,
                                                    int toYear) {
        Status status=statusRepository.findByOrderStatus(OrderStatus.Paid).orElseThrow(()->new AppException(ErrorCode.STATUS_NOT_FOUND));

        return orderRepository.revenueByYearRange(fromYear, toYear,status.getStatusId())
                .stream()
                .map(o -> {
                    int y = ((Number) o[0]).intValue();
                    int m = ((Number) o[1]).intValue();

                    return new RevenueReportResponse(
                            "Tháng " + m + "/" + y,
                            ((Number) o[2]).doubleValue()
                    );
                })
                .toList();
    }




    // ===================== THEO NGÀY =====================
    @Override
    public List<BestSellerRevenueResponse> byDayItem(LocalDate from, LocalDate to) {

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end   = to.atTime(23, 59, 59);

        return repo.topItemRevenueByDay(start, end, VALID_STATUS.name())
                .stream()
                .map(o -> new BestSellerRevenueResponse(
                        o[0].toString(),        // yyyy-MM-dd
                        (String) o[1],         // item name
                        ((Number) o[2]).doubleValue() // revenue
                ))
                .toList();
    }


    // ===================== THEO TUẦN =====================
    @Override
    public List<BestSellerRevenueResponse> byWeekItem(int year,
                                                      int fromMonth,
                                                      int toMonth) {

        return repo.topItemRevenueByWeek(
                        year, fromMonth, toMonth, VALID_STATUS.name())
                .stream()
                .map(o -> {
                    int y = ((Number) o[0]).intValue();
                    int m = ((Number) o[1]).intValue();
                    int w = ((Number) o[2]).intValue();

                    return new BestSellerRevenueResponse(
                            "Tuần " + w + " - Tháng " + m + "/" + y,
                            (String) o[3],                  // item name
                            ((Number) o[4]).doubleValue()  // revenue
                    );
                })
                .toList();
    }


    // ===================== THEO THÁNG =====================
    @Override
    public List<BestSellerRevenueResponse> byMonthItem(int fromYear,
                                                       int toYear) {

        return repo.topItemRevenueByMonth(
                        fromYear, toYear, VALID_STATUS.name())
                .stream()
                .map(o -> {
                    int y = ((Number) o[0]).intValue();
                    int m = ((Number) o[1]).intValue();

                    return new BestSellerRevenueResponse(
                            "Tháng " + m + "/" + y,
                            (String) o[2],                  // item name
                            ((Number) o[3]).doubleValue()  // revenue
                    );
                })
                .toList();
    }
}
