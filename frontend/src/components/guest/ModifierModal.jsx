import { useState } from "react";
import Overlay from "../common/Overlay";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function ModifierModal({ item, groups, onConfirm, onClose }) {
  const [selected, setSelected] = useState({});
  const [errors, setErrors] = useState({});

  const selectOption = (group, option) => {
    setSelected((prev) => ({
      ...prev,
      [group.modifierGroupId]: [option],
    }));

    // clear error khi chọn
    setErrors((prev) => ({
      ...prev,
      [group.modifierGroupId]: false,
    }));
  };

  const handleConfirm = () => {
    const newErrors = {};

    groups.forEach((g) => {
      if (g.isRequired && !selected[g.modifierGroupId]?.length) {
        newErrors[g.modifierGroupId] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng chọn đầy đủ các tùy chọn bắt buộc");
      return;
    }

    const result = groups.map((g) => ({
      modifierGroupId: g.modifierGroupId,
      modifierGroupName: g.name,
      options: selected[g.modifierGroupId] || [],
    }));

    onConfirm(result);
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-[95%] max-h-[85vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-5 shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {item.itemName}
            </h3>
            <p className="text-sm text-gray-500">Chọn tùy chọn cho món ăn</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-red-100 h-fit p-2 rounded-md cursor-pointer"
          >
            <X />
          </button>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {groups.map((g) => (
            <div
              key={g.modifierGroupId}
              className={`mt-6 rounded-xl p-4 border
                ${
                  errors[g.modifierGroupId]
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-800">{g.name}</p>
                {g.isRequired && (
                  <span className="text-xs text-red-500 font-semibold">
                    Bắt buộc
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {g.options.map((opt) => {
                  const isSelected =
                    selected[g.modifierGroupId]?.[0]?.modifierOptionId ===
                    opt.modifierOptionId;

                  return (
                    <button
                      key={opt.modifierOptionId}
                      onClick={() => selectOption(g, opt)}
                      className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition-all
                        ${
                          isSelected
                            ? "bg-blue-500 text-white shadow"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                    >
                      <span className="font-medium">{opt.name}</span>
                      <span className="text-sm">
                        +{opt.price.toLocaleString()}đ
                      </span>
                    </button>
                  );
                })}
              </div>

              {errors[g.modifierGroupId] && (
                <p className="text-xs text-red-500 mt-2">
                  Vui lòng chọn 1 tùy chọn
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="p-4 shadow-top bg-white flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition cursor-pointer"
          >
            Hủy
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </Overlay>
  );
}
