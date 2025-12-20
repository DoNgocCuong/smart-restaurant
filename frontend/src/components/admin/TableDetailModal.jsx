import { QrCode, Pencil, Download, X } from "lucide-react";
import Overlay from "../common/Overlay";
import qrApi from "../../api/qrApi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
export default function TableDetailModal({ table, onClose, onEdit, onQR }) {
  const [qrUrl, setQrUrl] = useState("");

  const handleDownloadQR = async (table) => {
    try {
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

        pdf.save(`QR_${table.tableName}.pdf`);
      };
    } catch {
      toast.error("Download QR failed");
    }
  };
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await qrApi.getQRById(table.tableId);

        setQrUrl(res.result.qr_url);
      } catch (err) {
        toast.error("Lấy QR thất bại");
        console.error(err);
      }
    };

    fetchQR();
  }, []);

  console.log(table);

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-xl w-[420px] p-6 shadow-lg">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">{table.tableName}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer hover:bg-red-200 w-8 h-8 flex justify-center items-center rounded-md"
          >
            <X size={18} />
          </button>
        </div>

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

        <div className="border border-gray-300 rounded-lg p-4 mb-4 text-center">
          <img src={qrUrl} className="mx-auto w-36 h-36 object-contain" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onEdit}
            className="border border-gray-300  rounded py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100"
          >
            <Pencil size={14} /> Chỉnh sửa
          </button>
          <button
            onClick={onQR}
            className="border border-gray-300 rounded py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100"
          >
            <QrCode size={14} /> <span>Tạo lại QR</span>
          </button>
          <button
            onClick={() => handleDownloadQR(table)}
            className="border border-gray-300  rounded py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100"
          >
            <Download size={14} /> Tải QR
          </button>
        </div>
      </div>
    </Overlay>
  );
}
