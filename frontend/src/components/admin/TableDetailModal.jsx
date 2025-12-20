import { QrCode, Pencil, Download, X } from "lucide-react";
import Overlay from "../common/Overlay";

export default function TableDetailModal({
  table,
  onClose,
  onEdit,
  onQR,
  onDownload,
}) {
  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-xl w-[420px] p-6 shadow-lg">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">{table.tableName}</h2>
          <button onClick={onClose}>
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
        </div>

        <div className="border border-gray-300 rounded-lg p-4 mb-4 text-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://restaurant.com/menu?tableId=${table.tableId}`}
            className="mx-auto w-36 h-36 object-contain"
          />
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
            onClick={onDownload}
            className="border border-gray-300  rounded py-2 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100"
          >
            <Download size={14} /> Tải QR
          </button>
        </div>
      </div>
    </Overlay>
  );
}
