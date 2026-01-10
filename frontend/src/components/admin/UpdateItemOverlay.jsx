import { useEffect, useState } from "react";
import Overlay from "../common/Overlay";
import { X } from "lucide-react";
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
      }
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
      <div className="bg-white w-[560px] max-w-[95%] rounded-2xl shadow-lg flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-7 shadow-md shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            Cập nhật sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-100 transition  cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Nội dung scroll */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tên món
              </label>
              <input
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Giá bán
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Danh mục
              </label>
              <select
                value={form.categoryIds[0] || ""}
                onChange={handleCategorySelect}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500 cursor-pointer"
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
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nhóm tùy chọn
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {modifierGroups.map((group) => (
                    <label
                      key={group.modifierGroupId}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        className=" cursor-pointer"
                        checked={form.modifierGroupIds.includes(
                          group.modifierGroupId
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">
                  Trạng thái:
                </label>
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium text-white cursor-pointer ${
                    form.status
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {form.status ? "Đang bán" : "Ngừng bán"}
                </button>
              </div>
              {/* 
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Hiển thị ở bếp
                </label>
                <input
                  type="checkbox"
                  checked={form.isKitchen}
                  onChange={handleIsKitchenToggle}
                />
              </div> */}
            </div>

            {/* Upload ảnh */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ảnh bìa sản phẩm
              </label>

              <div className="mt-2 flex flex-col items-center">
                {/* Nếu có ảnh, hiển thị ảnh + nút đổi ảnh */}
                {form.avatarUrl ? (
                  <div className="relative w-full">
                    <img
                      src={form.avatarUrl}
                      alt="preview"
                      className="w-full object-cover rounded-md border border-gray-300"
                    />
                    <label
                      htmlFor="image-upload"
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs font-medium cursor-pointer hover:bg-orange-100 transition"
                    >
                      Chọn ảnh mới
                    </label>
                  </div>
                ) : (
                  /* Nếu chưa có ảnh */
                  <label
                    htmlFor="image-upload"
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center hover:border-orange-400 transition cursor-pointer p-4 w-full"
                  >
                    <p className="text-sm text-gray-600">
                      Click để chọn ảnh hoặc kéo vào đây
                    </p>
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
                  <p className="text-xs text-orange-500 mt-2">
                    Đang upload ảnh...
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImg}
                className="px-5 py-2 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50  cursor-pointer"
              >
                {saving ? "Đang lưu..." : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Overlay>
  );
}

export default UpdateItemOverlay;
