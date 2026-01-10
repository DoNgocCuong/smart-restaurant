import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import tableApi from "../../api/tableApi";
import Overlay from "../common/Overlay";

export default function CreateTableDialog({ onClose }) {
  const [formData, setFormData] = useState({
    tableName: "",
    section: "Trong nhà",
    capacity: 1,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      tableName: "",
      section: "Trong nhà",
      capacity: "",
      is_active: true,
    });
  };

  useEffect(() => {
    resetForm();
  }, []);

  const handleCreate = async () => {
    if (!formData.tableName.trim()) {
      toast.error("Vui lòng nhập tên bàn");
      return;
    }

    if (formData.capacity < 1) {
      toast.error("Sức chứa phải lớn hơn 0");
      return;
    }

    const payload = {
      tableName: formData.tableName,
      section: formData.section,
      capacity: Number(formData.capacity),
      is_active: formData.is_active,
    };

    try {
      await tableApi.createTable(payload);
      toast.success("Tạo mới bàn thành công");
      onClose();
      resetForm();
    } catch (err) {
      console.error("CREATE TABLE ERROR:", err);
      toast.error("Tạo bàn thất bại!");
    }
  };

  return (
    <Overlay>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Tạo bàn mới</h2>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
            {/* Tên bàn */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tên bàn <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.tableName}
                onChange={(e) =>
                  setFormData({ ...formData, tableName: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                  transition-all duration-200"
                placeholder="VD: Bàn 01"
              />
            </div>

            {/* Khu vực */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Khu vực <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                  bg-white cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                  transition-all duration-200"
              >
                <option value="Sảnh chung">Sảnh chung</option>
                <option value="Sân thượng">Sân thượng</option>
                <option value="Phòng riêng">Phòng riêng</option>
              </select>
            </div>

            {/* Sức chứa */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Sức chứa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                  transition-all duration-200"
                placeholder="VD: 4"
              />
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.is_active ? "active" : "inactive"}
                disabled
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "active",
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                  bg-gray-50 cursor-not-allowed opacity-60"
              >
                <option value="active">Hoạt động</option>
              </select>
            </div>
          </div>

          {/* Footer - Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg
                text-sm font-medium text-gray-700
                hover:bg-gray-100 hover:border-gray-400
                active:scale-95
                transition-all duration-200"
            >
              Hủy
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2.5 bg-gray-900 rounded-lg
                text-sm font-medium text-white
                hover:bg-gray-800
                active:scale-95
                transition-all duration-200"
            >
              Tạo bàn
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
