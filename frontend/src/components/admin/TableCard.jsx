"use client";

import { useState } from "react";
import TableDetailModal from "./TableDetailModal";

// 🧩 Hàm xác định trạng thái bàn
const getTableStatus = (table) => {
  // Bàn không hoạt động
  if (!table.is_active) return "inactive";

  // Bàn đang hoạt động
  switch (table.statusTable) {
    case "occupied":
      return "occupied";
    case "unoccupied":
    case null:
    default:
      return "available";
  }
};

export default function TableCard({ table, onEdit, onQR, onDownload }) {
  const [open, setOpen] = useState(false);
  const status = getTableStatus(table);

  // 🖌️ Cấu hình giao diện theo trạng thái
  const statusConfig = {
    available: {
      label: "Có sẵn",
      border: "border-green-500/50",
      bg: "bg-green-50",
      text: "text-green-700",
    },
    occupied: {
      label: "Đã sử dụng",
      border: "border-red-500/50",
      bg: "bg-red-50",
      text: "text-red-700",
    },
    inactive: {
      label: "Không hoạt động",
      border: "border-gray-300",
      bg: "bg-gray-50",
      text: "text-gray-400",
    },
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`w-[260px] rounded-xl border-2 p-4 cursor-pointer transition hover:shadow-md
          ${statusConfig[status].border}
          ${statusConfig[status].bg}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{table.tableName}</h3>
          <span className={`text-xs ${statusConfig[status].text}`}>
            {statusConfig[status].label}
          </span>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div>Khu vực: {table.section}</div>
          <div>Sức chứa: {table.capacity}</div>
        </div>
      </div>

      {open && (
        <TableDetailModal
          table={table}
          onClose={() => setOpen(false)}
          onEdit={onEdit}
          onQR={onQR}
          onDownload={onDownload}
        />
      )}
    </>
  );
}
