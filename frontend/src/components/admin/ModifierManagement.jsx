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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 md:p-6 w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Quản lý tùy chọn sản phẩm
        </h3>

        <button
          onClick={() => setShowGroupForm(!showGroupForm)}
          className={` px-3 py-2
            text-sm
            rounded-md transition flex items-center gap-1 cursor-pointer
          ${
            showGroupForm
              ? "bg-blue-100 text-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showGroupForm ? <X size={16} /> : <Plus size={18} />}
          {showGroupForm ? "Hủy" : "Thêm loại tùy chọn"}
        </button>
      </div>

      {/* CREATE GROUP FORM */}
      {showGroupForm && (
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50 space-y-4">
          <h4 className="font-semibold text-blue-800">Tạo loại tùy chọn</h4>

          <input
            className="w-full border border-blue-500 rounded-lg px-3 py-2"
            placeholder="Tên loại"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <select
            className="w-full border border-blue-500 rounded-lg px-3 py-2"
            value={selectionType}
            onChange={(e) => setSelectionType(e.target.value)}
          >
            <option value="SINGLE">SINGLE</option>
            <option value="MULTIPLE">MULTIPLE</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
            />
            Bắt buộc chọn
          </label>

          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Lưu
          </button>
        </div>
      )}

      {/* LIST GROUPS */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-gray-700">
          Danh sách loại tùy chọn
        </h4>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          groups.map((group) => (
            <div
              key={group.modifierGroupId}
              className="border border-gray-300 rounded-xl p-4 space-y-3"
            >
              {/* GROUP HEADER (CLICK TO EXPAND) */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpandedGroupId(
                    expandedGroupId === group.modifierGroupId
                      ? null
                      : group.modifierGroupId
                  )
                }
              >
                <div>
                  <p className="font-semibold">{group.name}</p>
                  <p className="text-sm text-gray-500">
                    {group.selectionType} •{" "}
                    {group.isRequired ? "Bắt buộc" : "Không bắt buộc"}
                  </p>
                </div>

                <span className="text-gray-500 text-sm">
                  {expandedGroupId === group.modifierGroupId ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </span>
              </div>

              {/* EXPANDED CONTENT */}
              {expandedGroupId === group.modifierGroupId && (
                <>
                  {/* ADD OPTION BUTTON */}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setActiveGroupId(
                          activeGroupId === group.modifierGroupId
                            ? null
                            : group.modifierGroupId
                        )
                      }
                      className={`text-sm px-3 py-2 rounded flex items-center gap-1 cursor-pointer
                      ${
                        activeGroupId === group.modifierGroupId
                          ? "bg-green-600/20 text-green-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {activeGroupId === group.modifierGroupId ? (
                        <X size={14} />
                      ) : (
                        <Plus size={14} />
                      )}
                      {activeGroupId === group.modifierGroupId
                        ? "Hủy"
                        : "Thêm tùy chọn"}
                    </button>
                  </div>
                  {/* FORM CREATE OPTION */}
                  {activeGroupId === group.modifierGroupId && (
                    <div className="bg-green-50 border border-green-400 rounded-lg p-4 space-y-3">
                      <input
                        className="w-full border border-green-400 rounded-lg px-3 py-2"
                        placeholder="Tên tùy chọn"
                        value={optionName}
                        onChange={(e) => setOptionName(e.target.value)}
                      />

                      <input
                        type="text"
                        className="w-full border border-green-400 rounded-lg px-3 py-2"
                        placeholder="Giá"
                        value={optionPrice}
                        onChange={(e) => setOptionPrice(e.target.value)}
                      />

                      <button
                        onClick={() =>
                          handleCreateOption(group.modifierGroupId)
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Lưu
                      </button>
                    </div>
                  )}

                  {/* LIST OPTIONS */}
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-sm text-gray-700">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">
                            Tùy chọn
                          </th>
                          <th className="text-right px-4 py-3 font-medium">
                            Giá
                          </th>
                          <th className="text-right px-4 py-3 font-medium w-32">
                            Thao tác
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {group.options?.map((opt) => (
                          <tr
                            key={opt.modifierOptionId}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3">
                              {editingOptionId === opt.modifierOptionId ? (
                                <input
                                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                  value={editOptionName}
                                  onChange={(e) =>
                                    setEditOptionName(e.target.value)
                                  }
                                />
                              ) : (
                                <span className="font-medium">{opt.name}</span>
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {editingOptionId === opt.modifierOptionId ? (
                                <input
                                  className="w-12 ml-auto rounded-lg border border-gray-300 px-3 py-2 text-sm text-right"
                                  value={editOptionPrice}
                                  onChange={(e) =>
                                    setEditOptionPrice(e.target.value)
                                  }
                                />
                              ) : (
                                opt.price
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {editingOptionId === opt.modifierOptionId ? (
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleUpdateOption(opt.modifierOptionId)
                                    }
                                    className="bg-green-500 text-white px-3 py-1.5 rounded text-xs"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={() => setEditingOptionId(null)}
                                    className="bg-gray-100 px-3 py-1.5 rounded text-xs"
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
                                  className="text-blue-600 text-xs"
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
                              className="px-4 py-6 text-center text-gray-400 italic"
                            >
                              Chưa có tùy chọn
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ModifierManagement;
