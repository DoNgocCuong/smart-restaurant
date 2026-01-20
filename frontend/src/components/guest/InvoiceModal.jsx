import { X, Download } from "lucide-react";
import Overlay from "../common/Overlay";
import orderApi from "../../api/orderApi";
import momoPaymentApi from "../../api/momoPaymentApi";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import RobotoRegular from "../../utils/pdf/font/Roboto-Regular.ttf";

export default function InvoiceModal({ invoice, onClose }) {
  const navigate = useNavigate();
  if (!invoice) return null;

  console.log(invoice);

  const handleCashPayment = async () => {
    try {
      // logic sai nên Tranfer là tiền mặt
      const res1 = await orderApi.updatePaymentType(invoice.orderId, {
        paymentType: "Tranfer",
      });
      const res2 = await orderApi.updateStatus(invoice.orderId, {
        status: "Pending_payment",
      });

      toast.success("Yêu cầu thanh toán thành công, vui lòng chờ xử lý!");
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", err);
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    }
  };

  const handleMomoPayment = async () => {
    try {
      const res = await momoPaymentApi.createMomo(
        Number(invoice.orderId),
        "Thanh toán cho đơn hàng",
      );
      console.log("Res Momo:", res);
      // mở trang mới
      window.open(res.payUrl, "_blank");
    } catch (err) {
      console.error("Lỗi tạo yêu cầu thanh toán MoMo:", err);
      toast.error("Tạo yêu cầu thanh toán MoMo thất bại");
    }
  };

  const handleDownload = async () => {
    try {
      const doc = new jsPDF();

      // Load font Roboto và ĐỢI nó load xong hoàn toàn
      const response = await fetch(RobotoRegular);
      const fontBlob = await response.blob();
      const reader = new FileReader();

      // Đợi font load xong
      await new Promise((resolve) => {
        reader.onload = function () {
          const base64Font = reader.result.split(",")[1];
          doc.addFileToVFS("Roboto-Regular.ttf", base64Font);
          doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
          resolve();
        };
        reader.readAsDataURL(fontBlob);
      });

      // BẮT BUỘC set font trước khi vẽ bất cứ thứ gì
      doc.setFont("Roboto", "normal");

      // Header
      doc.setFontSize(20);
      doc.text("HÓA ĐƠN", 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.text(`#${invoice.orderId}`, 105, 28, { align: "center" });

      // Customer Info
      doc.setFontSize(11);
      doc.text("Thông tin khách hàng", 20, 45);
      doc.setFontSize(10);
      doc.text(invoice.customerName, 20, 52);
      doc.text(`Bàn: ${invoice.tableName}`, 20, 58);

      // Date
      doc.setFontSize(11);
      doc.text("Ngày tạo", 140, 45);
      doc.setFontSize(10);
      const dateStr = new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(dateStr, 140, 52);

      // Items Table
      const tableData = [];
      invoice.detailOrders.forEach((item) => {
        const modifierTotal =
          item.modifiers?.reduce((sum, m) => sum + m.price, 0) || 0;
        const itemTotal = item.price + modifierTotal;
        const rowTotal = itemTotal * item.quantity;

        tableData.push([
          item.itemName,
          item.quantity.toString(),
          `${itemTotal.toLocaleString()} đ`,
          `${rowTotal.toLocaleString()} đ`,
        ]);

        if (item.modifiers && item.modifiers.length > 0) {
          item.modifiers.forEach((modifier) => {
            tableData.push([
              `  - ${modifier.modifierGroupName}: ${modifier.name}`,
              "",
              `+${modifier.price.toLocaleString()} đ`,
              "",
            ]);
          });
        }
      });

      // Set font trước khi vẽ bảng
      doc.setFont("Roboto", "normal");

      autoTable(doc, {
        startY: 70,
        head: [["Sản phẩm", "SL", "Đơn giá", "Thành tiền"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 10,
          fontStyle: "normal", // Đổi từ "bold" sang "normal"
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
          halign: "center",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: [0, 0, 0],
          lineWidth: 0.1,
          lineColor: [200, 200, 200],
          font: "Roboto",
          fontStyle: "normal",
        },
        columnStyles: {
          0: { cellWidth: 80, halign: "left" },
          1: { halign: "center", cellWidth: 20 },
          2: { halign: "right", cellWidth: 40 },
          3: { halign: "right", cellWidth: 40 },
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        didDrawPage: function (data) {
          // Set lại font sau mỗi trang
          doc.setFont("Roboto", "normal");
        },
      });

      let finalY = doc.lastAutoTable.finalY + 10;

      // Set font lại trước phần totals
      doc.setFont("Roboto", "normal");

      if (invoice.special) {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.rect(20, finalY, 170, 12);
        doc.setFontSize(9);
        doc.text("Ghi chú: ", 25, finalY + 7);
        doc.text(invoice.special, 45, finalY + 7);
        finalY += 18;
      }

      doc.setFontSize(10);
      doc.text("Tạm tính:", 120, finalY);
      doc.text(`${invoice.subtotal.toLocaleString()} đ`, 190, finalY, {
        align: "right",
      });
      finalY += 7;

      if (invoice.discount > 0) {
        doc.text("Giảm giá:", 120, finalY);
        doc.text(`-${invoice.discount.toLocaleString()} đ`, 190, finalY, {
          align: "right",
        });
        finalY += 7;
      }

      if (invoice.tax > 0) {
        doc.text("Thuế VAT:", 120, finalY);
        doc.text(`+${invoice.tax.toLocaleString()} đ`, 190, finalY, {
          align: "right",
        });
        finalY += 7;
      }

      doc.setLineWidth(0.5);
      doc.line(120, finalY, 190, finalY);
      finalY += 5;

      doc.setFontSize(12);
      doc.text("Tổng cộng:", 120, finalY);
      doc.text(`${invoice.total.toLocaleString()} đ`, 190, finalY, {
        align: "right",
      });

      doc.save(`invoice_${invoice.orderId}.pdf`);
      toast.success("Tải xuống hóa đơn thành công!");
    } catch (err) {
      console.error("Lỗi tải hóa đơn:", err);
      toast.error("Tải hóa đơn thất bại");
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white w-[90vw] max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Hóa Đơn</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[75vh] overflow-auto">
          {/* Invoice Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">HÓA ĐƠN</h1>
            <p className="text-gray-600">#{invoice.orderId}</p>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Thông tin khách hàng
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {invoice.customerName}
              </p>
              <p className="text-sm text-gray-600">Bàn: {invoice.tableName}</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Ngày tạo
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">
                    Sản phẩm
                  </th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-700">
                    SL
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">
                    Đơn giá
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.detailOrders.map((item) => {
                  const modifierTotal =
                    item.modifiers?.reduce((sum, m) => sum + m.price, 0) || 0;
                  const itemTotal = item.price + modifierTotal;
                  const rowTotal = itemTotal * item.quantity;

                  return (
                    <React.Fragment key={item.detailOrderId}>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 text-sm text-gray-800">
                          {item.itemName}
                        </td>
                        <td className="text-center py-3 text-sm text-gray-800">
                          {item.quantity}
                        </td>
                        <td className="text-right py-3 text-sm text-gray-800">
                          {itemTotal.toLocaleString()} đ
                        </td>
                        <td className="text-right py-3 text-sm font-semibold text-gray-800">
                          {rowTotal.toLocaleString()} đ
                        </td>
                      </tr>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <tr>
                          <td colSpan="4" className="py-2 pl-4">
                            <div className="text-xs text-gray-600 space-y-1">
                              {item.modifiers.map((modifier) => (
                                <div key={modifier.modifierOptionId}>
                                  - {modifier.modifierGroupName}:{" "}
                                  {modifier.name} (+
                                  {modifier.price.toLocaleString()} đ)
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Special Notes */}
          {invoice.special && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-8">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Ghi chú:</span>{" "}
                {invoice.special}
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Tạm tính</span>
              <span className="text-gray-800 font-semibold">
                {invoice.subtotal.toLocaleString()} đ
              </span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Giảm giá</span>
                <span className="text-red-600 font-semibold">
                  -{invoice.discount.toLocaleString()} đ
                </span>
              </div>
            )}

            {invoice.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Thuế VAT</span>
                <span className="text-gray-800 font-semibold">
                  +{invoice.tax.toLocaleString()} đ
                </span>
              </div>
            )}

            <div className="border-t border-gray-300 pt-3 flex justify-between">
              <span className="font-bold text-lg text-gray-800">Tổng cộng</span>
              <span className="font-bold text-2xl text-blue-600">
                {invoice.total.toLocaleString()} đ
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              Tải xuống
            </button>
            <button
              onClick={handleCashPayment}
              className="flex items-center gap-2 px-4 py-2 bg-green-200 hover:bg-green-300 text-gray-800 font-semibold rounded-lg transition"
            >
              Thanh toán tiền mặt
            </button>
            <button
              onClick={handleMomoPayment}
              className="flex text-white items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 font-semibold rounded-lg transition"
            >
              Thanh toán MoMo
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
