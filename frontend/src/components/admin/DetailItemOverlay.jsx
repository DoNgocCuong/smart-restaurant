import { useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";
import Overlay from "../common/Overlay";
import UpdateItemOverlay from "./UpdateItemOverlay";
import modifierGroupApi from "../../api/modifierGroupApi";

function DetailItemOverlay({ item, onClose, onUpdate }) {
  const [modifierGroups, setModifierGroups] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  useEffect(() => {
    const fetchModifierGroups = async () => {
      if (!item?.modifierGroupId || item.modifierGroupId.length === 0) return;
      try {
        const results = await Promise.all(
          item.modifierGroupId.map(async (id) => {
            const res = await modifierGroupApi.findById(id);
            return res.result;
          })
        );
        setModifierGroups(results);
      } catch (error) {
        console.error("Fetch modifier groups failed:", error);
      }
    };

    fetchModifierGroups();
  }, [item]);

  if (!item) return null;

  return (
    <>
      <Overlay>
        <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-w-[95%] overflow-hidden relative transition-all duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-5 pb-3 shadow-md bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Thông tin món
            </h2>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium cursor-pointer"
                onClick={() => setShowUpdate(true)}
              >
                <Pencil size={16} /> Cập nhật
              </button>
              <button
                className="text-gray-400 hover:bg-red-100 p-1 rounded-md transition cursor-pointer"
                onClick={onClose}
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="p-6 overflow-y-auto max-h-[85vh]">
            {/* Ảnh */}
            <div className="overflow-hidden rounded-xl mb-5 shadow-sm">
              <img
                src={
                  item.avatarUrl ||
                  "https://res.cloudinary.com/dznocieoi/image/upload/v1766487761/istockphoto-1396814518-612x612_upvria.jpg"
                }
                alt={item.itemName}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thông tin món */}
            <div className="flex flex-col gap-2 mb-4">
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                {item.itemName}
              </h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {item.description}
              </p>
            </div>

            {/* Danh mục */}
            {item.category && item.category.length > 0 && (
              <div className="mb-5">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Danh mục
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.category.map((cat) => (
                    <span
                      key={cat.categoryId}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {cat.categoryName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ===== MODIFIER GROUPS ===== */}
            {modifierGroups.length > 0 && (
              <div className="mt-7">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Tuỳ chọn thêm
                </h3>
                <div className="flex flex-col gap-5">
                  {modifierGroups.map((group) => (
                    <div
                      key={group.modifierGroupId}
                      className="border border-gray-200 rounded-xl p-4 bg-linear-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-800 text-base">
                          {group.name}
                        </span>
                        <span className="text-xs text-gray-500 italic">
                          {group.selectionType === "SINGLE"
                            ? "Chọn 1"
                            : "Chọn nhiều"}{" "}
                          {group.isRequired && "(bắt buộc)"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => (
                          <div
                            key={opt.modifierOptionId}
                            className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition"
                          >
                            <span className="font-medium text-gray-700">
                              {opt.name}
                            </span>
                            <span className="text-gray-500 text-xs">
                              +{opt.price.toLocaleString()}₫
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Overlay>

      {/* Hiển thị UpdateItemOverlay khi bấm nút */}
      {showUpdate && (
        <UpdateItemOverlay
          item={item}
          modifierGroups={modifierGroups}
          onClose={() => setShowUpdate(false)}
          onUpdate
        />
      )}
    </>
  );
}

export default DetailItemOverlay;
