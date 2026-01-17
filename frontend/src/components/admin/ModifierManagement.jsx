import { useEffect, useState } from "react";
import modifierGroupApi from "../../api/modifierGroupApi";
import modifierOptionApi from "../../api/modifierOptionApi";
import toast from "react-hot-toast";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";

function ModifierManagement() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== TOGGLE FORM =====
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(null);

  // ===== EXPAND / COLLAPSE GROUP =====
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  // ===== CREATE GROUP STATE =====
  const [groupName, setGroupName] = useState("");
  const [selectionType, setSelectionType] = useState("SINGLE");
  const [isRequired, setIsRequired] = useState(true);

  // ===== CREATE OPTION STATE =====
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState("");

  // ===== EDIT OPTION STATE =====
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [editOptionName, setEditOptionName] = useState("");
  const [editOptionPrice, setEditOptionPrice] = useState("");

  // ===== FETCH GROUPS =====
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await modifierGroupApi.getAll();
      setGroups(res.result || []);
    } catch {
      toast.error("Không thể tải Modifier Group");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // ===== CREATE GROUP =====
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Tên group không được để trống");
      return;
    }

    try {
      await modifierGroupApi.create({
        name: groupName,
        selectionType,
        isRequired,
      });

      toast.success("Tạo Modifier Group thành công");
      setGroupName("");
      setSelectionType("SINGLE");
      setIsRequired(true);
      setShowGroupForm(false);
      fetchGroups();
    } catch {
      toast.error("Tạo Modifier Group thất bại");
    }
  };

  // ===== CREATE OPTION =====
  const handleCreateOption = async (groupId) => {
    if (!optionName.trim()) {
      toast.error("Tên option không được để trống");
      return;
    }

    try {
      await modifierOptionApi.create({
        name: optionName,
        price: Number(optionPrice),
        modifierGroupId: groupId,
      });

      toast.success("Tạo Modifier Option thành công");
      setOptionName("");
      setOptionPrice("");
      setActiveGroupId(null);
      fetchGroups();
    } catch {
      toast.error("Tạo Modifier Option thất bại");
    }
  };

  // ===== UPDATE OPTION =====
  const handleUpdateOption = async (optionId) => {
    if (!editOptionName.trim()) {
      toast.error("Tên option không được để trống");
      return;
    }

    try {
      await modifierOptionApi.update(optionId, {
        name: editOptionName,
        price: Number(editOptionPrice),
      });

      toast.success("Cập nhật tùy chọn thành công");
      setEditingOptionId(null);
      fetchGroups();
    } catch {
      toast.error("Cập nhật tùy chọn thất bại");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-4 sm:p-5 md:p-7 w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
          Quản lý tùy chọn sản phẩm
        </h3>

        <button
          onClick={() => setShowGroupForm(!showGroupForm)}
          className={`
            px-4 py-2.5
            text-sm font-medium
            rounded-xl
            transition-all duration-300
            flex items-center gap-2
            cursor-pointer
            ${
              showGroupForm
                ? "bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100"
                : "bg-linear-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-sm"
            }
          `}
        >
          {showGroupForm ? (
            <X size={18} strokeWidth={2.5} />
          ) : (
            <Plus size={18} strokeWidth={2.5} />
          )}
          {showGroupForm ? "Hủy" : "Thêm loại tùy chọn"}
        </button>
      </div>

      {/* CREATE GROUP FORM */}
      {showGroupForm && (
        <div className="border-2 border-blue-100 rounded-2xl p-5 bg-linear-to-br from-blue-50 to-white space-y-4 shadow-sm">
          <h4 className="font-bold text-lg text-blue-700">Tạo loại tùy chọn</h4>

          <input
            className="
              w-full
              border-2 border-blue-200
              rounded-xl
              px-4 py-2.5
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              transition-all duration-300
            "
            placeholder="Nhập tên loại..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <select
            className="
              w-full
              border-2 border-blue-200
              rounded-xl
              px-4 py-2.5
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              bg-white
              transition-all duration-300
            "
            value={selectionType}
            onChange={(e) => setSelectionType(e.target.value)}
          >
            <option value="SINGLE">SINGLE (Chọn một)</option>
            <option value="MULTIPLE">MULTIPLE (Chọn nhiều)</option>
          </select>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            Bắt buộc chọn
          </label>

          <button
            onClick={handleCreateGroup}
            className="
              w-full
              bg-linear-to-r from-emerald-600 to-emerald-700
              text-white
              px-4 py-2.5
              rounded-xl
              hover:from-emerald-700 hover:to-emerald-800
              text-sm font-medium
              transition-all duration-300
              shadow-sm
            "
          >
            Lưu
          </button>
        </div>
      )}

      {/* LIST GROUPS */}
      <div className="space-y-4">
        <h4 className="font-bold text-base text-blue-700">
          Danh sách loại tùy chọn
        </h4>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-linear-to-r from-blue-100 to-blue-50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <p className="text-center text-blue-400 py-8 font-medium">
            📭 Chưa có loại tùy chọn nào
          </p>
        ) : (
          groups.map((group) => (
            <div
              key={group.modifierGroupId}
              className="border-2 border-blue-100 rounded-2xl p-5 space-y-4 hover:border-blue-200 hover:shadow-md transition-all duration-300"
            >
              {/* GROUP HEADER (CLICK TO EXPAND) */}
              <div
                className="flex justify-between items-center cursor-pointer group/header"
                onClick={() =>
                  setExpandedGroupId(
                    expandedGroupId === group.modifierGroupId
                      ? null
                      : group.modifierGroupId,
                  )
                }
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-base">
                    {group.name}
                  </p>
                  <p className="text-sm text-blue-500 font-medium">
                    {group.selectionType === "SINGLE"
                      ? "Chọn một"
                      : "Chọn nhiều"}{" "}
                    • {group.isRequired ? "✓ Bắt buộc" : "○ Không bắt buộc"}
                  </p>
                </div>

                <div className="text-blue-600 group-hover/header:text-blue-700 transition-colors">
                  {expandedGroupId === group.modifierGroupId ? (
                    <ChevronUp size={24} strokeWidth={2} />
                  ) : (
                    <ChevronDown size={24} strokeWidth={2} />
                  )}
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              {expandedGroupId === group.modifierGroupId && (
                <div className="space-y-4 pt-2 border-t-2 border-blue-100">
                  {/* ADD OPTION BUTTON */}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setActiveGroupId(
                          activeGroupId === group.modifierGroupId
                            ? null
                            : group.modifierGroupId,
                        )
                      }
                      className={`
                        text-sm
                        px-4 py-2
                        rounded-xl
                        flex items-center gap-2
                        font-medium
                        transition-all duration-300
                        cursor-pointer
                        ${
                          activeGroupId === group.modifierGroupId
                            ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100"
                            : "bg-linear-to-r from-emerald-600 to-emerald-700 text-white border-2 border-emerald-600 hover:from-emerald-700 hover:to-emerald-800 shadow-sm"
                        }
                      `}
                    >
                      {activeGroupId === group.modifierGroupId ? (
                        <X size={16} strokeWidth={2.5} />
                      ) : (
                        <Plus size={16} strokeWidth={2.5} />
                      )}
                      {activeGroupId === group.modifierGroupId
                        ? "Hủy"
                        : "Thêm tùy chọn"}
                    </button>
                  </div>

                  {/* FORM CREATE OPTION */}
                  {activeGroupId === group.modifierGroupId && (
                    <div className="bg-linear-to-br from-emerald-50 to-white border-2 border-emerald-100 rounded-2xl p-4 space-y-3 shadow-sm">
                      <input
                        className="
                          w-full
                          border-2 border-emerald-200
                          rounded-xl
                          px-4 py-2.5
                          text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-emerald-500
                          focus:border-transparent
                          transition-all duration-300
                        "
                        placeholder="Tên tùy chọn..."
                        value={optionName}
                        onChange={(e) => setOptionName(e.target.value)}
                      />

                      <input
                        type="text"
                        className="
                          w-full
                          border-2 border-emerald-200
                          rounded-xl
                          px-4 py-2.5
                          text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-emerald-500
                          focus:border-transparent
                          transition-all duration-300
                        "
                        placeholder="Giá (VNĐ)..."
                        value={optionPrice}
                        onChange={(e) => setOptionPrice(e.target.value)}
                      />

                      <button
                        onClick={() =>
                          handleCreateOption(group.modifierGroupId)
                        }
                        className="
                          w-full
                          bg-linear-to-r from-emerald-600 to-emerald-700
                          text-white
                          px-4 py-2.5
                          rounded-xl
                          hover:from-emerald-700 hover:to-emerald-800
                          text-sm font-medium
                          transition-all duration-300
                          shadow-sm
                        "
                      >
                        Lưu
                      </button>
                    </div>
                  )}

                  {/* LIST OPTIONS */}
                  <div className="overflow-x-auto rounded-2xl border-2 border-blue-100 bg-white shadow-sm">
                    <table className="w-full text-sm text-gray-700">
                      <thead className="bg-linear-to-r from-blue-50 to-blue-50 border-b-2 border-blue-100">
                        <tr>
                          <th className="text-left px-4 py-3 font-bold text-blue-700">
                            Tùy chọn
                          </th>
                          <th className="text-right px-4 py-3 font-bold text-blue-700">
                            Giá
                          </th>
                          <th className="text-right px-4 py-3 font-bold text-blue-700 w-32">
                            Thao tác
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-blue-100">
                        {group.options?.map((opt) => (
                          <tr
                            key={opt.modifierOptionId}
                            className="hover:bg-blue-50 transition-colors duration-200"
                          >
                            <td className="px-4 py-3">
                              {editingOptionId === opt.modifierOptionId ? (
                                <input
                                  className="
                                    w-32
                                    rounded-lg
                                    border-2 border-blue-200
                                    px-3 py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-transparent
                                  "
                                  value={editOptionName}
                                  onChange={(e) =>
                                    setEditOptionName(e.target.value)
                                  }
                                />
                              ) : (
                                <span className="font-semibold text-gray-800">
                                  {opt.name}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {editingOptionId === opt.modifierOptionId ? (
                                <input
                                  className="
                                    w-20
                                    ml-auto
                                    rounded-lg
                                    border-2 border-blue-200
                                    px-3 py-2
                                    text-sm
                                    text-right
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-transparent
                                  "
                                  value={editOptionPrice}
                                  onChange={(e) =>
                                    setEditOptionPrice(e.target.value)
                                  }
                                />
                              ) : (
                                <span className="font-semibold text-gray-800">
                                  {opt.price}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {editingOptionId === opt.modifierOptionId ? (
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleUpdateOption(opt.modifierOptionId)
                                    }
                                    className="
                                      bg-linear-to-r from-emerald-600 to-emerald-700
                                      text-white
                                      px-3 py-1.5
                                      rounded-lg
                                      text-xs
                                      font-medium
                                      hover:from-emerald-700 hover:to-emerald-800
                                      transition-all duration-300
                                    "
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={() => setEditingOptionId(null)}
                                    className="
                                      bg-gray-200
                                      text-gray-700
                                      px-3 py-1.5
                                      rounded-lg
                                      text-xs
                                      font-medium
                                      hover:bg-gray-300
                                      transition-all duration-300
                                    "
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingOptionId(opt.modifierOptionId);
                                    setEditOptionName(opt.name);
                                    setEditOptionPrice(opt.price);
                                  }}
                                  className="
                                    text-blue-600
                                    hover:text-blue-700
                                    text-xs
                                    font-medium
                                    hover:bg-blue-50
                                    px-2 py-1
                                    rounded-lg
                                    transition-all duration-300
                                  "
                                >
                                  Sửa
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}

                        {(!group.options || group.options.length === 0) && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-6 text-center text-blue-400 italic font-medium"
                            >
                              Chưa có tùy chọn
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ModifierManagement;
