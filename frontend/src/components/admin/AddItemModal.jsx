import { useEffect, useState } from "react";
import itemApi from "../../api/itemApi";
import categoryApi from "../../api/categoryApi";
import Overlay from "../common/Overlay";
import toast from "react-hot-toast";
import modifierGroupApi from "../../api/modifierGroupApi";
import { X, Upload } from "lucide-react";

/* ================= CLOUDINARY CONFIG ================= */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function AddItemModal({ onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingModifiers, setLoadingModifiers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    price: "",
    status: true,
    isKitchen: true,
    avatarUrl: "",
    categoryIds: [],
    modifierGroupIds: [],
  });

  /* ================= FETCH CATEGORY ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAllCategories();
        setCategories(res?.result || []);
      } catch (err) {
        toast.error("Không tải được danh mục");
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= FETCH MODIFIER GROUP ================= */
  useEffect(() => {
    const fetchModifiers = async () => {
      try {
        const res = await modifierGroupApi.getAll();
        setModifierGroups(res?.result || []);
      } catch {
        toast.error("Không tải được nhóm tùy chọn");
      } finally {
        setLoadingModifiers(false);
      }
    };

    fetchModifiers();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (e) => {
    const value = Number(e.target.value);
    setForm((prev) => ({
      ...prev,
      categoryIds: value ? [value] : [],
    }));
  };

  const handleModifierToggle = (groupId) => {
    setForm((prev) => {
      const exists = prev.modifierGroupIds.includes(groupId);
      return {
        ...prev,
        modifierGroupIds: exists
          ? prev.modifierGroupIds.filter((id) => id !== groupId)
          : [...prev.modifierGroupIds, groupId],
      };
    });
  };

  /* ================= CLOUDINARY UPLOAD ================= */
  const handleUploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );

    const json = await res.json();

    if (!res.ok) {
      console.error("Cloudinary error:", json);
      throw new Error(json.error?.message || "Upload failed");
    }

    return json.secure_url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImg(true);
      const url = await handleUploadImage(file);

      setForm((prev) => ({
        ...prev,
        avatarUrl: url,
      }));

      toast.success("Upload ảnh thành công");
    } catch (err) {
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploadingImg(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.itemName.trim()) {
      toast.error("Tên sản phẩm không được để trống");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Giá phải lớn hơn 0");
      return;
    }

    if (form.categoryIds.length === 0) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    try {
      setSaving(true);

      await itemApi.addNewItem({
        ...form,
        price: Number(form.price),
      });

      toast.success("Thêm sản phẩm thành công");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Thêm sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Overlay onClose={onClose}>
      {/* container chính chia làm header cố định + nội dung cuộn */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[90vh] md:h-auto md:max-h-[95vh] border border-blue-100">
        {/* Header cố định */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-7 border-b-2 border-blue-100 shrink-0 bg-linear-to-r from-blue-50 to-white rounded-t-3xl">
          <h2 className="text-lg sm:text-xl font-bold ">Thêm sản phẩm</h2>
          <button
            onClick={onClose}
            className="
              w-9 h-9
              flex items-center justify-center
              rounded-xl
              text-gray-400
              hover:bg-red-100 hover:text-red-600
              transition-all duration-300
              cursor-pointer
            "
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Nội dung scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          <div className="space-y-5">
            {/* Item name */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Tên sản phẩm</label>
              <input
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm..."
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
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả sản phẩm..."
                rows={3}
                className="
                  w-full
                  border-2 border-blue-200
                  rounded-xl
                  px-4 py-2.5
                  text-sm
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                "
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Giá bán</label>
              <input
                type="text"
                step="0.1"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ví dụ: 25000"
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
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Danh mục</label>
              <select
                value={form.categoryIds[0] || ""}
                onChange={handleCategorySelect}
                className="
                  w-full
                  border-2 border-blue-200
                  rounded-xl
                  px-4 py-2.5
                  text-sm
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  transition-all duration-300
                  cursor-pointer
                "
              >
                <option value="">-- Chọn danh mục --</option>
                {!loadingCategory &&
                  categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Modifier Groups */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Nhóm tùy chọn</label>
              {loadingModifiers ? (
                <p className="text-sm text-gray-500">Đang tải...</p>
              ) : modifierGroups.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Chưa có nhóm tùy chọn
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  {modifierGroups.map((group) => (
                    <label
                      key={group.modifierGroupId}
                      className="
                        flex items-center gap-2.5
                        text-sm
                        text-gray-700
                        font-medium
                        cursor-pointer
                        p-2
                        rounded-lg
                        hover:bg-white
                        transition-colors duration-200
                      "
                    >
                      <input
                        type="checkbox"
                        checked={form.modifierGroupIds.includes(
                          group.modifierGroupId,
                        )}
                        onChange={() =>
                          handleModifierToggle(group.modifierGroupId)
                        }
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                      />
                      {group.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <label className="text-sm font-bold">Ảnh sản phẩm</label>

              {!form.avatarUrl && (
                <label
                  htmlFor="image-upload"
                  className="
                    border-2 border-dashed border-blue-300
                    rounded-2xl
                    flex flex-col items-center justify-center
                    text-center
                    hover:border-blue-500 hover:bg-blue-50
                    transition-all duration-300
                    cursor-pointer
                    p-6
                  "
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload
                      size={28}
                      className="text-blue-500"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm font-medium text-gray-700">
                      Click để chọn ảnh
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG — dung lượng nhỏ hơn 5MB
                    </p>
                  </div>
                </label>
              )}
              {uploadingImg && (
                <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-blue-600 font-medium">
                    Đang upload ảnh...
                  </p>
                </div>
              )}
              {form.avatarUrl && (
                <div className="space-y-2">
                  <img
                    src={form.avatarUrl}
                    alt="preview"
                    className="
                      w-full
                      h-40
                      object-cover
                      rounded-2xl
                      border-2 border-blue-200
                    "
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, avatarUrl: "" }))
                    }
                    className="
                      w-full
                      text-sm
                      text-red-600
                      hover:text-red-700
                      hover:bg-red-50
                      py-2
                      rounded-lg
                      transition-colors duration-300
                      font-medium
                    "
                  >
                    Thay đổi ảnh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer cố định */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 lg:p-7 border-t-2 border-blue-100 shrink-0 bg-blue-50 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="
              px-5 py-2.5
              text-sm
              font-medium
              rounded-xl
              border-2 border-gray-300
              text-gray-700
              hover:border-gray-400
              hover:bg-gray-100
              transition-all duration-300
            "
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploadingImg}
            className="
              px-6 py-2.5
              text-sm
              font-medium
              rounded-xl
              bg-linear-to-r from-blue-600 to-blue-700
              text-white
              border-2 border-blue-600
              hover:from-blue-700 hover:to-blue-800
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-all duration-300
              shadow-sm
            "
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

export default AddItemModal;
