import { useEffect, useState } from "react";
import Overlay from "../common/Overlay";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import itemApi from "../../api/itemApi";
import categoryApi from "../../api/categoryApi";
import modifierGroupApi from "../../api/modifierGroupApi";

/* ================= CLOUDINARY CONFIG ================= */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function UpdateItemOverlay({ item, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [modifierGroups, setModifierGroups] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    itemName: item?.itemName || "",
    description: item?.description || "",
    price: item?.price || "",
    avatarUrl: item?.avatarUrl || "",
    status: item?.status ?? true,
    isKitchen: item?.isKitchen ?? true,
    categoryIds: item?.category?.map((c) => c.categoryId) || [],
    modifierGroupIds: item?.modifierGroupId || [],
  });

  /* ================= FETCH CATEGORIES + MODIFIER GROUPS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, modRes] = await Promise.all([
          categoryApi.getAllCategories(),
          modifierGroupApi.getAll(),
        ]);
        setCategories(catRes?.result || []);
        setModifierGroups(modRes?.result || []);
      } catch {
        toast.error("Không tải được danh mục hoặc nhóm tùy chọn");
      }
    };
    fetchData();
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

  const handleStatusToggle = () =>
    setForm((prev) => ({ ...prev, status: !prev.status }));

  const handleIsKitchenToggle = () =>
    setForm((prev) => ({ ...prev, isKitchen: !prev.isKitchen }));

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
      setForm((prev) => ({ ...prev, avatarUrl: url }));
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
      toast.error("Tên món không được để trống");
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

    // body chuẩn backend yêu cầu
    const body = {
      itemName: form.itemName.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      avatarUrl: form.avatarUrl,
      status: Boolean(form.status),
      isKitchen: Boolean(form.isKitchen),
      categoryIds: form.categoryIds,
      modifierGroupIds: form.modifierGroupIds,
    };

    try {
      setSaving(true);
      await itemApi.update(item.itemId, body);
      toast.success("Cập nhật món thành công");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1000ms = 1s

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Overlay onClose={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col h-[90vh] md:h-auto md:max-h-[95vh] border border-blue-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-7 shadow-sm border-b-2 border-blue-100 shrink-0 bg-linear-to-r from-blue-50 to-white rounded-t-3xl">
          <h2 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            Cập nhật sản phẩm
          </h2>
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
              <label className="text-sm font-bold text-blue-700">Tên món</label>
              <input
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="Nhập tên món..."
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
              <label className="text-sm font-bold text-blue-700">Mô tả</label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả sản phẩm..."
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
              <label className="text-sm font-bold text-blue-700">Giá bán</label>
              <input
                type="number"
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
              <label className="text-sm font-bold text-blue-700">
                Danh mục
              </label>
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
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Modifier groups */}
            {modifierGroups.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-700">
                  Nhóm tùy chọn
                </label>
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
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                        checked={form.modifierGroupIds.includes(
                          group.modifierGroupId,
                        )}
                        onChange={() =>
                          handleModifierToggle(group.modifierGroupId)
                        }
                      />
                      {group.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Status & isKitchen */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 flex-1">
                <label className="text-sm font-bold text-blue-700">
                  Trạng thái:
                </label>
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className={`
                    px-4 py-2
                    rounded-xl
                    text-sm
                    font-bold
                    text-white
                    cursor-pointer
                    transition-all duration-300
                    border-2
                    shadow-sm
                    ${
                      form.status
                        ? "bg-linear-to-r from-emerald-600 to-emerald-700 border-emerald-600 hover:from-emerald-700 hover:to-emerald-800"
                        : "bg-linear-to-r from-red-600 to-red-700 border-red-600 hover:from-red-700 hover:to-red-800"
                    }
                  `}
                >
                  {form.status ? "✓ Đang bán" : "✕ Ngừng bán"}
                </button>
              </div>
            </div>

            {/* Upload ảnh */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-700">
                Ảnh bìa sản phẩm
              </label>

              <div className="mt-2 flex flex-col items-center">
                {/* Nếu có ảnh, hiển thị ảnh + nút đổi ảnh */}
                {form.avatarUrl ? (
                  <div className="relative w-full group">
                    <img
                      src={form.avatarUrl}
                      alt="preview"
                      className="w-full h-48 sm:h-56 object-cover rounded-2xl border-2 border-blue-200"
                    />
                    <label
                      htmlFor="image-upload"
                      className="
                        absolute top-3 right-3
                        bg-white/90 backdrop-blur-sm
                        border-2 border-blue-200
                        text-blue-700
                        px-3 py-1.5
                        rounded-lg
                        text-xs
                        font-bold
                        cursor-pointer
                        hover:bg-white
                        hover:border-blue-300
                        transition-all duration-300
                      "
                    >
                      Thay ảnh
                    </label>
                  </div>
                ) : (
                  /* Nếu chưa có ảnh */
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
                      w-full
                    "
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload
                        size={28}
                        className="text-blue-500"
                        strokeWidth={1.5}
                      />
                      <p className="text-sm font-medium text-gray-700">
                        Click để chọn ảnh hoặc kéo vào đây
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG — dung lượng nhỏ hơn 5MB
                      </p>
                    </div>
                  </label>
                )}

                {/* Input ẩn, luôn tồn tại để chọn lại ảnh */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {uploadingImg && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200 w-full mt-3">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-blue-600 font-medium">
                      Đang upload ảnh...
                    </p>
                  </div>
                )}
              </div>
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
              cursor-pointer
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
              cursor-pointer
            "
          >
            {saving ? "Đang lưu..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

export default UpdateItemOverlay;
