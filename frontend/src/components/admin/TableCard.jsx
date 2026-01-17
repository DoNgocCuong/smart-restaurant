"use client";

import { useState } from "react";
import { Users, MapPin } from "lucide-react";
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
      badge: "🟢",
      border: "border-emerald-200 hover:border-emerald-300",
      bg: "bg-gradient-to-br from-emerald-50 to-white",
      text: "text-emerald-700",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      icon: "text-emerald-600",
    },
    occupied: {
      label: "Đã sử dụng",
      badge: "🔴",
      border: "border-red-200 hover:border-red-300",
      bg: "bg-gradient-to-br from-red-50 to-white",
      text: "text-red-700",
      badgeBg: "bg-red-100",
      badgeText: "text-red-700",
      icon: "text-red-600",
    },
    inactive: {
      label: "Không hoạt động",
      badge: "⚪",
      border: "border-gray-200 hover:border-gray-300",
      bg: "bg-gradient-to-br from-gray-50 to-white",
      text: "text-gray-500",
      badgeBg: "bg-gray-100",
      badgeText: "text-gray-600",
      icon: "text-gray-400",
    },
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`
          w-full max-w-xs rounded-2xl border-2 p-5
          cursor-pointer
          transition-all duration-300
          hover:shadow-lg hover:scale-105
          group
          ${statusConfig[status].border}
          ${statusConfig[status].bg}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
            {table.tableName}
          </h3>
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusConfig[status].badgeBg} ${statusConfig[status].badgeText}`}
          >
            {statusConfig[status].badge} {statusConfig[status].label}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2.5">
          {/* Khu vực */}
          <div className="flex items-center gap-2">
            <MapPin
              size={16}
              className={statusConfig[status].icon}
              strokeWidth={2.5}
            />
            <span className="text-sm text-gray-600 font-medium">
              Khu vực:{" "}
              <strong className="text-gray-800">{table.section}</strong>
            </span>
          </div>

          {/* Sức chứa */}
          <div className="flex items-center gap-2">
            <Users
              size={16}
              className={statusConfig[status].icon}
              strokeWidth={2.5}
            />
            <span className="text-sm text-gray-600 font-medium">
              Sức chứa:{" "}
              <strong className="text-gray-800">{table.capacity} người</strong>
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className={`text-xs font-semibold ${statusConfig[status].text}`}>
            {status === "available" && "✓ Sẵn sàng cho khách"}
            {status === "occupied" && "⏱ Khách đang sử dụng"}
            {status === "inactive" && "✕ Tạm không hoạt động"}
          </div>
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
