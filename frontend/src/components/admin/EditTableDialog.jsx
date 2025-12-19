import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export default function EditTableDialog({ onClose, setTables, tables, table }) {
  // ✅ formData khớp schema ERD
  const [formData, setFormData] = useState({
    table_id: table.table_id,
    table_name: table.table_name,
    section: table.section,
    is_active: table.is_active,
    created_at: table.created_at,
    updated_at: table.updated_at,
    qr_history: table.qr_history || [],
  });

  // ✅ Cập nhật bàn
  const handleEdit = () => {
    const updatedTable = {
      ...formData,
      updated_at: new Date().toISOString().split("T")[0],
    };

    setTables(
      tables.map((t) => (t.table_id === table.table_id ? updatedTable : t))
    );

    console.log("Updated table:", updatedTable);
    toast.success("Cập nhật bàn thành công!");
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Chỉnh sửa bàn
        </h2>

        <div className="space-y-4">
          {/* Tên bàn */}
          <div className="space-y-2">
            <label
              htmlFor="edit-table-name"
              className="text-sm font-medium text-gray-700"
            >
              Tên bàn *
            </label>
            <input
              id="edit-table-name"
              type="text"
              value={formData.table_name}
              onChange={(e) =>
                setFormData({ ...formData, table_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>

          {/* Khu vực */}
          <div className="space-y-2">
            <label
              htmlFor="edit-section"
              className="text-sm font-medium text-gray-700"
            >
              Khu vực *
            </label>
            <select
              id="edit-section"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 text-sm"
            >
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Patio">Patio</option>
              <option value="VIP Room">VIP Room</option>
            </select>
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <label
              htmlFor="edit-is-active"
              className="text-sm font-medium text-gray-700"
            >
              Trạng thái *
            </label>
            <select
              id="edit-is-active"
              value={formData.is_active ? "active" : "inactive"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_active: e.target.value === "active",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 text-sm"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
}
