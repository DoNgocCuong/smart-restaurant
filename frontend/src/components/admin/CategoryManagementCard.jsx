import { useState, useEffect } from "react";
import categoryApi from "../../api/categoryApi";
import toast from "react-hot-toast";
import { Plus, Edit2, Check, X } from "lucide-react";

function CategoryManagementCard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // create category state
  const [showCreate, setShowCreate] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [creating, setCreating] = useState(false);

  // update category state
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      if (res?.result) {
        setCategories(res.result);
      } else {
        toast.error("Không lấy được danh mục");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // CREATE
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      setCreating(true);
      await categoryApi.createCategory({
        categoryName: categoryName.trim(),
      });

      toast.success("Thêm danh mục thành công");
      setCategoryName("");
      setShowCreate(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Thêm danh mục thất bại");
    } finally {
      setCreating(false);
    }
  };

  // UPDATE
  const handleUpdateCategory = async (categoryId) => {
    if (!editingName.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      setUpdating(true);
      await categoryApi.updateCategory(categoryId, {
        categoryName: editingName.trim(),
      });

      toast.success("Cập nhật danh mục thành công");
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật danh mục thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-4 sm:p-5 md:p-7 w-full hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            Quản lý danh mục
          </h3>
        </div>

        <button
          onClick={() => setShowCreate((prev) => !prev)}
          className={`
            px-4 py-2.5
            text-sm font-medium
            rounded-xl
            flex items-center gap-2
            transition-all duration-300
            ${
              showCreate
                ? "bg-blue-50 text-blue-700 border-2 border-blue-200 hover:bg-blue-100"
                : "bg-linear-to-r from-blue-600 to-blue-700 text-white border-2 border-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-sm"
            }
            cursor-pointer
          `}
        >
          <Plus size={18} strokeWidth={2.5} />
          {showCreate ? "Đóng" : "Thêm danh mục"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div
          className="
            mb-6
            p-5
            rounded-2xl
            border-2 border-blue-100
            bg-linear-to-br from-blue-50 to-white
            flex flex-col sm:flex-row gap-3
            shadow-sm
          "
        >
          <input
            type="text"
            placeholder="Nhập tên danh mục..."
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="
              flex-1
              px-4 py-2.5
              text-sm
              rounded-xl
              border-2 border-blue-200
              bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              transition-all duration-300
            "
          />

          <button
            onClick={handleCreateCategory}
            disabled={creating}
            className="
              px-5 py-2.5
              text-sm font-medium
              rounded-xl
              bg-linear-to-r from-emerald-600 to-emerald-700
              text-white
              hover:from-emerald-700 hover:to-emerald-800
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              shadow-sm
            "
          >
            {creating ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 bg-linear-to-r from-blue-100 to-blue-50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-base text-blue-400 py-8 text-center font-medium">
          📭 Chưa có danh mục nào
        </p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="
                flex flex-col gap-3
                sm:flex-row sm:items-center sm:justify-between
                p-4
                rounded-2xl
                border-2 border-blue-100
                bg-white
                hover:border-blue-200 hover:shadow-md
                transition-all duration-300
              "
            >
              {/* VIEW MODE */}
              {editingId !== category.categoryId ? (
                <div className="flex justify-between w-full items-center">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-base">
                      {category.categoryName}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingId(category.categoryId);
                      setEditingName(category.categoryName);
                    }}
                    className="
                      flex items-center gap-1.5
                      text-sm font-medium
                      text-blue-600
                      hover:text-blue-700
                      hover:bg-blue-50
                      px-3 py-1.5
                      rounded-lg
                      transition-all duration-300
                    "
                  >
                    <Edit2 size={16} />
                    Chỉnh sửa
                  </button>
                </div>
              ) : (
                /* EDIT MODE */
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="
                      flex-1
                      px-4 py-2.5
                      text-sm
                      rounded-xl
                      border-2 border-blue-200
                      bg-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-transparent
                      transition-all duration-300
                    "
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCategory(category.categoryId)}
                      disabled={updating}
                      className="
                        flex items-center gap-1.5
                        px-4 py-2.5
                        text-sm font-medium
                        rounded-xl
                        bg-linear-to-r from-emerald-600 to-emerald-700
                        text-white
                        hover:from-emerald-700 hover:to-emerald-800
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
                      "
                    >
                      <Check size={16} />
                      Lưu
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="
                        flex items-center gap-1.5
                        px-4 py-2.5
                        text-sm font-medium
                        rounded-xl
                        bg-gray-200
                        text-gray-700
                        hover:bg-gray-300
                        transition-all duration-300
                      "
                    >
                      <X size={16} />
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryManagementCard;
