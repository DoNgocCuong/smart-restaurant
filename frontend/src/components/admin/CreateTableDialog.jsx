import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import tableApi from "../../api/tableApi";
import Overlay from "../common/Overlay";
import { X } from "lucide-react";

export default function CreateTableDialog({ onClose }) {
  const [formData, setFormData] = useState({
    tableName: "",
    section: "Trong nhà",
    capacity: 1,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);

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
      setSaving(true);
      await tableApi.createTable(payload);
      toast.success("Tạo mới bàn thành công");
      onClose();
      resetForm();
    } catch (err) {
      console.error("CREATE TABLE ERROR:", err);
      toast.error("Tạo bàn thất bại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-blue-100 bg-linear-to-r from-blue-50 to-white rounded-t-3xl">
            <h2 className="text-lg sm:text-xl font-bold ">Tạo bàn mới</h2>
            <button
              onClick={onClose}
              className="
                w-8 h-8
                flex items-center justify-center
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

          {/* Content */}
          <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
            {/* Tên bàn */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
                Tên bàn <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.tableName}
                onChange={(e) =>
                  setFormData({ ...formData, tableName: e.target.value })
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
                "
              />
            </div>

            {/* Khu vực */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
                Khu vực <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                className="
                  w-full
                  px-4 py-2.5
                  border-2 border-blue-200
                  rounded-xl
                  text-sm
                  bg-white
                  cursor-pointer
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                "
              >
                <option value="Sảnh chung">Sảnh chung</option>
                <option value="Sân thượng">Sân thượng</option>
                <option value="Phòng riêng">Phòng riêng</option>
              </select>
            </div>

            {/* Sức chứa */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
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
                "
              />
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <div
                className="
                w-full
                px-4 py-2.5
                border-2 border-blue-200
                rounded-xl
                text-sm
                bg-blue-50
                cursor-not-allowed
                flex items-center
              "
              >
                <span className="font-medium">✓ Hoạt động</span>
              </div>
            </div>
          </div>

          {/* Footer - Buttons */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-blue-50 border-t-2 border-blue-100 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 rounded-b-3xl">
            <button
              onClick={onClose}
              disabled={saving}
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
                active:scale-95
                transition-all duration-200
                cursor-pointer
              "
            >
              Hủy
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
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
                active:scale-95
                transition-all duration-200
                shadow-sm
                cursor-pointer
              "
            >
              {saving ? "Đang tạo..." : "Tạo bàn"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
