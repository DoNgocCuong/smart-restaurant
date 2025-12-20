import { QrCode, Pencil, Download, X, FileImage, FileText } from "lucide-react";
import Overlay from "../common/Overlay";
import qrApi from "../../api/qrApi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

export default function TableDetailModal({ table, onClose, onEdit }) {
  const [qrUrl, setQrUrl] = useState("");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🧩 Hàm tải QR dưới dạng PNG
  const handleDownloadPNG = async (table) => {
    try {
      if (!qrUrl) {
        toast.error("Không có mã QR");
        return;
      }

      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const createdDate = table.createAt
        ? table.createAt.substring(0, 10).replace(/-/g, "")
        : "unknown";
      const link = document.createElement("a");
      link.href = url;
      link.download = `${table.tableName}_${createdDate}.png`;
      link.click();

      URL.revokeObjectURL(url);
      toast.success("Đã tải ảnh PNG");
    } catch {
      toast.error("Tải PNG thất bại");
    }
  };

  // 🧩 Hàm tải QR dưới dạng PDF
  const handleDownloadPDF = async (table) => {
    try {
      if (!qrUrl) {
        toast.error("Không có mã QR");
        return;
      }

      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const pdf = new jsPDF("p", "mm", "a4");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("TABLE INFORMATION", 105, 20, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.text(`Table: ${table.tableName}`, 20, 45);
        pdf.text(`Section: ${table.section ?? "N/A"}`, 20, 55);
        pdf.text(`Capacity: ${table.capacity}`, 20, 65);
        pdf.text(
          `Status: ${
            table.is_active
              ? table.orders.length > 0
                ? "Occupied"
                : "Available"
              : "Inactive"
          }`,
          20,
          75
        );

        pdf.addImage(reader.result, "PNG", 120, 45, 60, 60);
        pdf.text("Scan QR to view menu", 150, 115, { align: "center" });

        const createdDate = table.createAt
          ? table.createAt.substring(0, 10).replace(/-/g, "")
          : "unknown";
        pdf.save(`${table.tableName}_${createdDate}.pdf`);
        toast.success("Đã tải PDF");
      };
    } catch {
      toast.error("Tải PDF thất bại");
    }
  };

  // 🧩 Lấy QR khi mở modal
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await qrApi.getQRById(table.tableId);
        const url = res?.result?.qr_url || null;
        setQrUrl(url);
      } catch (err) {
        setQrUrl(null);
        console.error(err);
      }
    };
    fetchQR();
  }, [table.tableId]);

  // 🧩 Hàm tạo lại mã QR
  const handleGenerateQr = async (table) => {
    try {
      setLoading(true);
      const res = await qrApi.generateQrbyId(table.tableId);
      const newUrl = res?.result?.qr_url;
      if (newUrl) {
        setQrUrl(newUrl);
        toast.success("Đã tạo lại mã QR thành công");
      } else {
        toast.error("Không nhận được mã QR mới");
      }
    } catch (err) {
      console.error(err);
      toast.error("Tạo lại QR thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="h-fit w-full md:w-1/2 lg:w-1/3 bg-white rounded-xl p-4 shadow-lg relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-base sm:text-lg">
            {table.tableName}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer hover:bg-red-200 w-8 h-8 flex justify-center items-center rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thông tin bàn */}
        <div className="text-sm space-y-2 mb-4">
          <div>Khu vực: {table.section}</div>
          <div>Sức chứa: {table.capacity}</div>
          <div>
            Trạng thái:{" "}
            {table.is_active
              ? table.orders.length > 0
                ? "Đang sử dụng"
                : "Có sẵn"
              : "Không hoạt động"}
          </div>
          <div>
            Ngày tạo:{" "}
            {table.createAt
              ? table.createAt.substring(8, 10) +
                "/" +
                table.createAt.substring(5, 7) +
                "/" +
                table.createAt.substring(0, 4)
              : "—"}
          </div>
        </div>

        {/* QR Preview */}
        <div className="relative border border-gray-300 rounded-lg p-3 sm:p-4 mb-4 text-center">
          {qrUrl ? (
            <div className="relative inline-block">
              <img
                src={qrUrl}
                alt="QR Code"
                className={`mx-auto w-32 h-32 sm:w-36 sm:h-36 object-contain transition-opacity duration-300 ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <p>{loading ? "Đang tạo mã QR..." : "Chưa có mã QR"}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={onEdit}
            className="border border-gray-300 rounded py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base"
          >
            <Pencil size={14} /> Chỉnh sửa
          </button>
          <button
            onClick={() => handleGenerateQr(table)}
            className="border border-gray-300 rounded py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base"
          >
            <QrCode size={14} /> {qrUrl ? "Tạo lại QR" : "Tạo QR"}
          </button>
          <button
            onClick={() => setShowDownloadOptions((prev) => !prev)}
            className="border border-gray-300 rounded py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 relative text-sm sm:text-base"
          >
            <Download size={14} /> Tải QR
          </button>
        </div>

        {/* Dropdown chọn định dạng */}
        {showDownloadOptions && (
          <div className="absolute right-4 sm:right-6 bottom-[80px] bg-white border border-gray-300 rounded-lg shadow-md w-40 animate-fadeIn z-10">
            <button
              onClick={() => {
                handleDownloadPNG(table);
                setShowDownloadOptions(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            >
              <FileImage size={16} /> Tải PNG
            </button>
            <button
              onClick={() => {
                handleDownloadPDF(table);
                setShowDownloadOptions(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            >
              <FileText size={16} /> Tải PDF
            </button>
          </div>
        )}
      </div>
    </Overlay>
  );
}
