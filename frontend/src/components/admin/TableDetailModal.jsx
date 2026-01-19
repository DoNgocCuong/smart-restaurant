import {
  QrCode,
  Pencil,
  Download,
  X,
  FileImage,
  FileText,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";
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
          75,
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

  // Helper function for status
  const getStatusInfo = () => {
    if (!table.is_active) {
      return {
        label: "Không hoạt động",
        color: "text-gray-600",
        bg: "bg-gray-100",
      };
    } else if (table.is_active || table.statusTable === "unoccupied") {
      return {
        label: "Có sẵn",
        color: "text-emerald-700",
        bg: "bg-emerald-100",
      };
    } else if (table.is_active || table.statusTable === "occupied") {
      return { label: "Đang sử dụng", color: "text-red-700", bg: "bg-red-100" };
    }
  };

  const statusInfo = getStatusInfo();

  // Helper function for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return (
      dateString.substring(8, 10) +
      "/" +
      dateString.substring(5, 7) +
      "/" +
      dateString.substring(0, 4)
    );
  };

  return (
    <Overlay onClose={onClose}>
      <div className="h-fit w-full max-w-lg mx-3 sm:mx-0 bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl border border-blue-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            {table.tableName}
          </h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8
              flex justify-center items-center
              rounded-lg
              text-gray-400
              hover:bg-red-100 hover:text-red-600
              transition-all duration-300
              cursor-pointer
            "
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Thông tin bàn */}
        <div className="space-y-3 mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          {/* Khu vực */}
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-blue-600" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Khu vực</p>
              <p className="text-sm font-semibold text-gray-800">
                {table.section}
              </p>
            </div>
          </div>

          {/* Sức chứa */}
          <div className="flex items-center gap-3">
            <Users size={18} className="text-blue-600" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Sức chứa</p>
              <p className="text-sm font-semibold text-gray-800">
                {table.capacity} người
              </p>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full ${statusInfo.bg}`}></div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Trạng thái</p>
              <p className={`text-sm font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </p>
            </div>
          </div>

          {/* Ngày tạo */}
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-blue-600" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Ngày tạo</p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDate(table.createAt)}
              </p>
            </div>
          </div>
        </div>

        {/* QR Preview */}
        <div className="relative border-2 border-blue-200 rounded-2xl p-4 sm:p-6 mb-6 text-center bg-linear-to-br from-blue-50 to-white">
          {qrUrl ? (
            <div className="relative inline-block">
              <img
                src={qrUrl}
                alt="QR Code"
                className={`mx-auto w-40 h-40 sm:w-48 sm:h-48 object-contain transition-opacity duration-300 ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="py-8">
              <p className="text-sm text-gray-500 font-medium">
                {loading ? "⏳ Đang tạo mã QR..." : "📱 Chưa có mã QR"}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <button
            onClick={onEdit}
            className="
              flex items-center justify-center gap-2
              px-4 py-2.5
              border-2 border-blue-200
              rounded-xl
              text-sm
              font-medium
              text-blue-700
              hover:border-blue-300
              hover:bg-blue-50
              transition-all duration-300
              cursor-pointer
            "
          >
            <Pencil size={16} strokeWidth={2.5} />
            <span>Chỉnh sửa</span>
          </button>
          <button
            onClick={() => handleGenerateQr(table)}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              px-4 py-2.5
              border-2 border-blue-200
              rounded-xl
              text-sm
              font-medium
              text-blue-700
              hover:border-blue-300
              hover:bg-blue-50
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-all duration-300
              cursor-pointer
            "
          >
            <QrCode size={16} strokeWidth={2.5} />
            <span>{qrUrl ? "Tạo lại QR" : "Tạo QR"}</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDownloadOptions((prev) => !prev)}
              className="
                w-full
                flex items-center justify-center gap-2
                px-4 py-2.5
                bg-linear-to-r from-emerald-600 to-emerald-700
                rounded-xl
                text-sm
                font-medium
                text-white
                border-2 border-emerald-600
                hover:from-emerald-700 hover:to-emerald-800
                transition-all duration-300
                cursor-pointer
                shadow-sm
              "
            >
              <Download size={16} strokeWidth={2.5} />
              <span>Tải QR</span>
            </button>

            {/* Dropdown chọn định dạng */}
            {showDownloadOptions && (
              <div className="absolute right-0 bottom-full mb-2 bg-white border-2 border-blue-200 rounded-xl shadow-lg w-44 overflow-hidden z-10">
                <button
                  onClick={() => {
                    handleDownloadPNG(table);
                    setShowDownloadOptions(false);
                  }}
                  className="
                    w-full
                    text-left
                    px-4 py-3
                    hover:bg-blue-50
                    flex items-center gap-3
                    cursor-pointer
                    border-b border-blue-100
                    transition-colors duration-200
                  "
                >
                  <FileImage
                    size={16}
                    className="text-blue-600"
                    strokeWidth={2}
                  />
                  <span className="font-medium text-gray-800">Tải PNG</span>
                </button>
                <button
                  onClick={() => {
                    handleDownloadPDF(table);
                    setShowDownloadOptions(false);
                  }}
                  className="
                    w-full
                    text-left
                    px-4 py-3
                    hover:bg-blue-50
                    flex items-center gap-3
                    cursor-pointer
                    transition-colors duration-200
                  "
                >
                  <FileText
                    size={16}
                    className="text-blue-600"
                    strokeWidth={2}
                  />
                  <span className="font-medium text-gray-800">Tải PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-500 text-center italic pt-2">
          💡 Quét mã QR để truy cập menu
        </p>
      </div>
    </Overlay>
  );
}
