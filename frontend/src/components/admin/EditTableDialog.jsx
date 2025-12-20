import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import tableApi from "../../api/tableApi";
import Overlay from "../common/Overlay"; // ✅ dùng lại overlay chung

export default function EditTableDialog({ onClose, table }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    table_id: table.tableId,
    table_name: table.tableName,
    capacity: table.capacity || 4,
    is_active: table.is_active,
  });

  // 🧩 Cập nhật bàn qua API
  const handleEdit = async () => {
    try {
      setLoading(true);
      const payload = {
        tableName: formData.table_name,
        capacity: Number(formData.capacity),
        is_active: formData.is_active,
      };
      await tableApi.updateTable(formData.table_id, payload);
      toast.success("Cập nhật bàn thành công!");
      onClose();
    } catch (err) {
      console.error("❌ Lỗi cập nhật bàn:", err);
      toast.error("Không thể cập nhật bàn!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-xl max-w-[420px] mx-6 sm:w-[420px] p-4 sm:p-6 shadow-lg relative animate-fadeIn">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-base sm:text-lg">
            Chỉnh sửa bàn {table.tableName}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer hover:bg-red-200 w-8 h-8 flex justify-center items-center rounded-md"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {/* Tên bàn */}
          <div className="space-y-2">
            <label
              htmlFor="edit-table-name"
              className="text-sm font-medium text-gray-700"
            >
              Tên bàn mới *
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

          {/* Sức chứa */}
          <div className="space-y-2">
            <label
              htmlFor="edit-capacity"
              className="text-sm font-medium text-gray-700"
            >
              Sức chứa *
            </label>
            <input
              id="edit-capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 text-sm"
            />
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
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleEdit}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}
