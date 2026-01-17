import { useState } from "react";
import Overlay from "../common/Overlay";
import toast from "react-hot-toast";
import imageApi from "../../api/imageApi";
import { X, Upload, Trash2 } from "lucide-react";

/* CLOUDINARY CONFIG */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function UploadImagesOverlay({ itemId, onClose, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState([]);

  /* ================= CLOUDINARY UPLOAD ================= */
  const uploadToCloudinary = async (file) => {
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
    if (!res.ok) throw new Error(json.error?.message);
    return json.secure_url;
  };

  /* ================= ADD IMAGE (ONE BY ONE) ================= */
  const handleAddImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);

      setUrls((prev) => [...prev, url]); // ✅ append
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploading(false);
      e.target.value = ""; // ✅ cho phép chọn lại cùng file
    }
  };

  /* ================= REMOVE IMAGE ================= */
  const handleRemove = (url) => {
    setUrls((prev) => prev.filter((u) => u !== url));
    toast.success("Đã xóa ảnh khỏi danh sách");
  };

  /* ================= SAVE TO BACKEND ================= */
  const handleSave = async () => {
    if (urls.length === 0) {
      toast.error("Chưa có ảnh nào");
      return;
    }

    try {
      await imageApi.uploadImages(itemId, {
        url: urls,
      });

      toast.success("Lưu ảnh thành công");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lưu ảnh thất bại");
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-7 border border-blue-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            Tải thêm ảnh sản phẩm
          </h3>
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

        {/* ===== ADD IMAGE ===== */}
        <label
          className="
            border-2 border-dashed border-blue-300
            rounded-2xl
            p-6 sm:p-8
            flex flex-col items-center justify-center
            cursor-pointer
            hover:border-blue-500
            hover:bg-blue-50
            transition-all duration-300
            mb-6
          "
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            disabled={uploading}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-blue-500" strokeWidth={1.5} />
            <p className="text-sm font-medium text-gray-800">
              Click để thêm ảnh
            </p>
            <p className="text-xs text-gray-500">
              Thêm từng ảnh một, JPG/PNG nhỏ hơn 5MB
            </p>
          </div>
        </label>

        {uploading && (
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200 mb-6">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-blue-600 font-medium">
              Đang upload ảnh...
            </p>
          </div>
        )}

        {/* ===== PREVIEW ===== */}
        {urls.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold text-blue-700 mb-3">
              Ảnh đã chọn ({urls.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {urls.map((u, idx) => (
                <div
                  key={u}
                  className="
                    relative
                    group
                    rounded-2xl
                    overflow-hidden
                    border-2 border-blue-100
                    hover:border-blue-300
                    transition-all duration-300
                  "
                >
                  <img
                    src={u}
                    alt={`preview-${idx}`}
                    className="
                      h-24 sm:h-32
                      w-full
                      object-cover
                      group-hover:scale-105
                      transition-transform duration-300
                    "
                  />

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(u)}
                    className="
                      absolute
                      top-2 right-2
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      w-7 h-7
                      rounded-full
                      flex items-center justify-center
                      opacity-0
                      group-hover:opacity-100
                      transition-all duration-300
                      shadow-md
                      cursor-pointer
                    "
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>

                  {/* Avatar badge */}
                  {idx === 0 && (
                    <span
                      className="
                        absolute
                        bottom-2 left-2
                        bg-linear-to-r from-blue-600 to-blue-700
                        text-white
                        text-[10px]
                        font-bold
                        px-2 py-1
                        rounded-lg
                        shadow-md
                      "
                    >
                      ⭐ Avatar
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {urls.length === 0 && !uploading && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">📸 Chưa có ảnh nào được thêm</p>
          </div>
        )}

        {/* ===== ACTIONS ===== */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t-2 border-blue-100">
          <button
            onClick={onClose}
            className="
              px-5 py-2.5
              border-2 border-gray-300
              rounded-xl
              text-sm
              font-medium
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
            disabled={uploading || urls.length === 0}
            onClick={handleSave}
            className="
              px-6 py-2.5
              bg-linear-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800
              text-white
              rounded-xl
              text-sm
              font-medium
              border-2 border-blue-600
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-all duration-300
              shadow-sm
              cursor-pointer
            "
          >
            Lưu ({urls.length})
          </button>
        </div>
      </div>
    </Overlay>
  );
}

export default UploadImagesOverlay;
