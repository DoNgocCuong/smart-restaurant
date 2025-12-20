import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import tableApi from "../../api/tableApi";

export default function CreateTableDialog({ onClose }) {
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: 1,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      table_name: "",
      capacity: 1,
      is_active: true,
    });
  };

  useEffect(() => {
    resetForm();
  }, []);

  const handleCreate = async () => {
    if (!formData.table_name.trim()) {
      toast.error("Vui lòng nhập tên bàn");
      return;
    }

    if (formData.capacity < 1) {
      toast.error("Sức chứa phải lớn hơn 0");
      return;
    }

    const payload = {
      tableName: formData.table_name,
      capacity: formData.capacity,
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
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div
        className="
    fixed left-1/2 top-1/2 z-50
    w-[90%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
    -translate-x-1/2 -translate-y-1/2
    rounded-xl bg-white p-4 sm:p-6 md:p-8
    shadow-lg
  "
      >
        <h2 className="text-lg font-semibold mb-4">Tạo bàn mới</h2>

        <div className="space-y-4">
          {/* Tên bàn */}
          <div>
            <label className="text-sm font-medium">Tên bàn *</label>
            <input
              value={formData.table_name}
              onChange={(e) =>
                setFormData({ ...formData, table_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
              placeholder="VD: Bàn 01"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium">Sức chứa *</label>
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
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
              placeholder="VD: 4"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Trạng thái *</label>
            <select
              value={formData.is_active ? "active" : "inactive"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_active: e.target.value === "active",
                })
              }
              className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
            >
              <option value="active">Hoạt động</option>
              {/* <option value="inactive">Không hoạt động</option> */}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-400 rounded-md py-2
              text-sm cursor-pointer hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 bg-gray-900 text-white rounded-md py-2
              text-sm cursor-pointer hover:opacity-90"
          >
            Tạo bàn
          </button>
        </div>
      </div>
    </>
  );
}
