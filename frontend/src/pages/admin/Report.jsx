import React, { useState, useEffect, useRef } from "react";
import { Calendar, TrendingUp, DollarSign, Package } from "lucide-react";
import * as Chart from "chart.js/auto";
import reportApi from "../../api/reportApi";

function Report() {
  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });
  const [weeklyRange, setWeeklyRange] = useState({
    year: new Date().getFullYear(),
    fromMonth: 1,
    toMonth: new Date().getMonth() + 1,
  });
  const [monthlyRange, setMonthlyRange] = useState({
    fromYear: new Date().getFullYear(),
    toYear: new Date().getFullYear(),
  });

  const [revenueData, setRevenueData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Refs for chart instances
  const revenueChartRef = useRef(null);
  const itemsChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const itemsChartInstance = useRef(null);

  useEffect(() => {
    fetchReports();
  }, [reportType, dateRange, weeklyRange, monthlyRange]);

  useEffect(() => {
    // Cleanup charts on unmount
    return () => {
      destroyCharts();
    };
  }, []);

  const destroyCharts = () => {
    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
      revenueChartInstance.current = null;
    }
    if (itemsChartInstance.current) {
      itemsChartInstance.current.destroy();
      itemsChartInstance.current = null;
    }
  };

  const fetchReports = async () => {
    setLoading(true);

    // Destroy existing charts BEFORE fetching new data
    destroyCharts();

    try {
      let revenueResponse, itemsResponse;

      switch (reportType) {
        case "daily":
          revenueResponse = await reportApi.revenueDaily(dateRange);
          itemsResponse = await reportApi.revenueDailyItems(dateRange);
          break;
        case "weekly":
          revenueResponse = await reportApi.revenueWeekly(weeklyRange);
          itemsResponse = await reportApi.revenueWeeklyItems(weeklyRange);
          break;
        case "monthly":
          revenueResponse = await reportApi.revenueMonthly(monthlyRange);
          itemsResponse = await reportApi.revenueMonthlyItems(monthlyRange);
          break;
      }

      const revenue = revenueResponse?.result || [];
      const items = itemsResponse?.result || [];

      console.log(revenue);
      console.log(items);
      
      
      setRevenueData(revenue);
      setItemsData(items);

      const total = revenue.reduce((sum, item) => sum + (item.revenue || 0), 0);
      setTotalRevenue(total);

      // Wait for state to update and DOM to be ready, then render charts
      setTimeout(() => {
        renderCharts(revenue, items);
      }, 100);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = (revenue, items) => {
    // Double check - destroy any existing charts
    destroyCharts();

    // Revenue Chart
    if (revenueChartRef.current && revenue.length > 0) {
      const ctx = revenueChartRef.current.getContext("2d");
      revenueChartInstance.current = new Chart.Chart(ctx, {
        type: "line",
        data: {
          labels: revenue.map((r) => r.label),
          datasets: [
            {
              label: "Doanh thu (VNĐ)",
              data: revenue.map((r) => r.revenue),
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `Doanh thu: ${context.parsed.y.toLocaleString("vi-VN")} ₫`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value.toLocaleString("vi-VN") + " ₫",
              },
            },
          },
        },
      });
    }

    // Best Selling Items Chart
    const itemsMap = {};
    items.forEach((item) => {
      if (!itemsMap[item.itemName]) {
        itemsMap[item.itemName] = 0;
      }
      itemsMap[item.itemName] += item.revenue;
    });

    const sortedItems = Object.entries(itemsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (itemsChartRef.current && sortedItems.length > 0) {
      const ctx = itemsChartRef.current.getContext("2d");
      itemsChartInstance.current = new Chart.Chart(ctx, {
        type: "bar",
        data: {
          labels: sortedItems.map((i) => i[0]),
          datasets: [
            {
              label: "Doanh thu (VNĐ)",
              data: sortedItems.map((i) => i[1]),
              backgroundColor: [
                "rgba(239, 68, 68, 0.8)",
                "rgba(249, 115, 22, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(132, 204, 22, 0.8)",
                "rgba(34, 197, 94, 0.8)",
                "rgba(20, 184, 166, 0.8)",
                "rgba(6, 182, 212, 0.8)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(99, 102, 241, 0.8)",
                "rgba(168, 85, 247, 0.8)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `Doanh thu: ${context.parsed.x.toLocaleString("vi-VN")} ₫`,
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value.toLocaleString("vi-VN") + " ₫",
              },
            },
          },
        },
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="col-start-2 col-end-12 min-h-screen">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
            Báo cáo Doanh thu
          </h1>
          <p className="text-sm text-gray-600">
            Theo dõi và phân tích doanh thu của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Tổng doanh thu
                </p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="bg-linear-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Số khoảng thời gian
                </p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {revenueData.length}
                </p>
              </div>
              <div className="bg-linear-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                  Sản phẩm bán chạy
                </p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {itemsData.length}
                </p>
              </div>
              <div className="bg-linear-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Report Type Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Loại báo cáo
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer"
              >
                <option value="daily">Theo ngày</option>
                <option value="weekly">Theo tuần</option>
                <option value="monthly">Theo tháng</option>
              </select>
            </div>

            {/* Date Range Inputs */}
            {reportType === "daily" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </>
            )}

            {reportType === "weekly" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Năm
                  </label>
                  <input
                    type="number"
                    value={weeklyRange.year}
                    onChange={(e) =>
                      setWeeklyRange({
                        ...weeklyRange,
                        year: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Từ tháng
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={weeklyRange.fromMonth}
                    onChange={(e) =>
                      setWeeklyRange({
                        ...weeklyRange,
                        fromMonth: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Đến tháng
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={weeklyRange.toMonth}
                    onChange={(e) =>
                      setWeeklyRange({
                        ...weeklyRange,
                        toMonth: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </>
            )}

            {reportType === "monthly" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Từ năm
                  </label>
                  <input
                    type="number"
                    value={monthlyRange.fromYear}
                    onChange={(e) =>
                      setMonthlyRange({
                        ...monthlyRange,
                        fromYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Đến năm
                  </label>
                  <input
                    type="number"
                    value={monthlyRange.toYear}
                    onChange={(e) =>
                      setMonthlyRange({
                        ...monthlyRange,
                        toYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Charts */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600 mb-3"></div>
              <div className="text-gray-500 text-sm font-medium">
                Đang tải dữ liệu...
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full mr-3"></span>
                Biểu đồ doanh thu
              </h2>
              <div className="h-64 rounded-xl overflow-hidden">
                {revenueData.length > 0 ? (
                  <canvas ref={revenueChartRef}></canvas>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Không có dữ liệu</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Best Selling Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-purple-600 rounded-full mr-3"></span>
                Sản phẩm bán chạy nhất
              </h2>
              <div className="h-80 rounded-xl overflow-hidden">
                {itemsData.length > 0 ? (
                  <canvas ref={itemsChartRef}></canvas>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Không có dữ liệu</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Report;
