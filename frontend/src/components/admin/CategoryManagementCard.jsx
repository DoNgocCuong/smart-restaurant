import { useState, useEffect } from "react";
import categoryApi from "../../api/categoryApi";
import toast from "react-hot-toast";

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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 md:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Quản lý danh mục
          </h3>
        </div>

        <button
          onClick={() => setShowCreate((prev) => !prev)}
          className={`
            px-3 py-2
            text-sm
            rounded-md
            ${
              showCreate
                ? "bg-gray-100 text-black border border-gray-200"
                : "bg-blue-600 text-white"
            }
            
            hover:bg-blue-700
            transition
            cursor-pointer
          `}
        >
          {showCreate ? "Đóng" : "+ Thêm danh mục"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreateCategory}
          className="
            mb-4
            p-3 sm:p-4
            rounded-lg
            border border-gray-100
            bg-gray-50
            flex flex-col sm:flex-row gap-2
          "
        >
          <input
            type="text"
            placeholder="Tên danh mục"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="
              flex-1
              px-3 py-2
              text-sm
              rounded-md
              border border-gray-300
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <button
            type="submit"
            disabled={creating}
            className="
              px-4 py-2
              text-sm
              rounded-md
              bg-green-600
              text-white
              hover:bg-green-700
              disabled:opacity-50
              transition
            "
          >
            {creating ? "Đang lưu..." : "Lưu"}
          </button>
        </form>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-sm text-gray-500 py-4 text-center sm:text-left">
          Đang tải danh mục...
        </p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center sm:text-left">
          Chưa có danh mục nào
        </p>
      ) : (
        <ul className="space-y-2 sm:space-y-3">
          {categories.map((category) => (
            <li
              key={category.categoryId}
              className="
                flex flex-col gap-2
                sm:flex-row sm:items-center sm:justify-between
                p-3 sm:p-4
                rounded-lg
                border border-gray-100
                hover:bg-gray-50
                transition
              "
            >
              {/* VIEW MODE */}
              {editingId !== category.categoryId ? (
                <div className="flex justify-between w-full">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {category.categoryName}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingId(category.categoryId);
                      setEditingName(category.categoryName);
                    }}
                    className=" text-sm text-blue-600 hover:underline"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              ) : (
                /* EDIT MODE */
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="
                      flex-1
                      px-3 py-2
                      text-sm
                      rounded-md
                      border border-gray-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCategory(category.categoryId)}
                      disabled={updating}
                      className="
                        px-3 py-2
                        text-sm
                        rounded-md
                        bg-green-600
                        text-white
                        hover:bg-green-700
                        disabled:opacity-50
                      "
                    >
                      Lưu
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="
                        px-3 py-2
                        text-sm
                        rounded-md
                        bg-gray-200
                        hover:bg-gray-300
                      "
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryManagementCard;
