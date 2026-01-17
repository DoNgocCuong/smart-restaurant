import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import tableApi from "../../api/tableApi";
import Overlay from "../common/Overlay";

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
    if (!formData.table_name.trim()) {
      toast.error("Vui lòng nhập tên bàn");
      return;
    }

    if (formData.capacity < 1) {
      toast.error("Sức chứa phải lớn hơn 0");
      return;
    }

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
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-50">
        <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-6 lg:p-7 shadow-2xl border border-blue-100">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-100">
            <h2 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              Chỉnh sửa bàn {table.tableName}
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="
                w-8 h-8
                flex justify-center items-center
                rounded-lg
                text-gray-400
                hover:bg-red-100 hover:text-red-600
                transition-all duration-300
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Tên bàn */}
            <div className="space-y-2">
              <label
                htmlFor="edit-table-name"
                className="text-sm font-bold text-blue-700"
              >
                Tên bàn mới <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-table-name"
                type="text"
                value={formData.table_name}
                onChange={(e) =>
                  setFormData({ ...formData, table_name: e.target.value })
                }
                placeholder="VD: Bàn 01"
                className="
                  w-full
                  px-4 py-2.5
                  border-2 border-blue-200
                  rounded-xl
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                  placeholder-gray-400
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                disabled={loading}
              />
            </div>

            {/* Sức chứa */}
            <div className="space-y-2">
              <label
                htmlFor="edit-capacity"
                className="text-sm font-bold text-blue-700"
              >
                Sức chứa <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="VD: 4"
                className="
                  w-full
                  px-4 py-2.5
                  border-2 border-blue-200
                  rounded-xl
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                  placeholder-gray-400
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                disabled={loading}
              />
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label
                htmlFor="edit-is-active"
                className="text-sm font-bold text-blue-700"
              >
                Trạng thái <span className="text-red-500">*</span>
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
                className="
                  w-full
                  px-4 py-2.5
                  border-2 border-blue-200
                  rounded-xl
                  text-sm
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                disabled={loading}
              >
                <option value="active">✓ Hoạt động</option>
                <option value="inactive">✕ Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Footer - Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-7 pt-5 border-t-2 border-blue-100">
            <button
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                px-4 py-2.5
                border-2 border-gray-300
                rounded-xl
                text-sm
                font-medium
                text-gray-700
                hover:border-gray-400
                hover:bg-gray-100
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-all duration-300
                cursor-pointer
              "
            >
              Hủy
            </button>
            <button
              onClick={handleEdit}
              disabled={loading}
              className="
                flex-1
                px-4 py-2.5
                bg-linear-to-r from-blue-600 to-blue-700
                rounded-xl
                text-sm
                font-medium
                text-white
                border-2 border-blue-600
                hover:from-blue-700
                hover:to-blue-800
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-all duration-300
                shadow-sm
                cursor-pointer
              "
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
