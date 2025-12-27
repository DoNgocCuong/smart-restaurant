import { useState } from "react";
import Overlay from "../common/Overlay";
import toast from "react-hot-toast";
import imageApi from "../../api/imageApi";

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
      }
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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Tải thêm ảnh</h3>

        {/* ===== ADD IMAGE ===== */}
        <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400">
          <input
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            className="hidden"
          />
          <p className="text-sm text-gray-600">Click để thêm ảnh</p>
          <p className="text-xs text-gray-500 mt-1">Thêm từng ảnh một</p>
        </label>

        {uploading && (
          <p className="text-xs text-blue-500 mt-2">Đang upload...</p>
        )}

        {/* ===== PREVIEW ===== */}
        {urls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {urls.map((u, idx) => (
              <div key={u} className="relative group">
                <img
                  src={u}
                  className="h-24 w-full object-cover rounded-md border"
                />
                <button
                  onClick={() => handleRemove(u)}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1 rounded">
                    Avatar
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== ACTIONS ===== */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm border-gray-400 hover:bg-gray-100 cursor-pointer"
          >
            Hủy
          </button>
          <button
            disabled={uploading}
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50  cursor-pointer"
          >
            Lưu
          </button>
        </div>
      </div>
    </Overlay>
  );
}

export default UploadImagesOverlay;
