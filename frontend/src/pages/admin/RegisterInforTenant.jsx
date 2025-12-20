import { useState } from "react";
import tenantApi from "../../api/tenantApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Upload } from "lucide-react";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const BANK_LIST = [
  "Vietcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "Techcombank",
  "MB Bank",
  "ACB",
  "Sacombank",
  "VPBank",
  "TPBank",
];

function RegisterInforTenant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameTenant: "",
    logoUrl: "",
    phone: "",
    address: "",
    openHours: "",
    closeHours: "",
    nameBank: "",
    bankNumber: "",
    bankAccountHolderName: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Upload IMG TO CLOUDINARY
  // ===============================
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await tenantApi.createInforTenant(formData);

      toast.success("Đăng ký nhà hàng thành công");

      // Sang trang Dashboard
      navigate(`/tenant-admin/dashboard`, { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Đăng ký nhà hàng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-start-2 col-end-12 space-y-6 py-6">
      <div className="w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold  mb-2">Đăng ký nhà hàng</h1>
        <p className="text-gray-500 mb-8">
          Vui lòng điền đầy đủ thông tin để đăng ký nhà hàng của bạn để sử dụng
          các chức năng khác
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:gap-6 ">
          {/* Tên nhà hàng */}
          <div>
            <label className="font-medium text-gray-700">Tên nhà hàng</label>
            <input
              name="nameTenant"
              value={formData.nameTenant}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Nhà hàng ABC"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="font-medium text-gray-700 mb-1 block">
              Logo nhà hàng
            </label>

            <div className="relative">
              {/* Hidden input */}
              <input
                type="file"
                accept="image/*"
                id="logo-upload"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  try {
                    setUploadingImg(true);
                    const imageUrl = await handleUploadImage(file);
                    setFormData((prev) => ({
                      ...prev,
                      logoUrl: imageUrl,
                    }));
                    toast.success("Upload logo thành công");
                  } catch (err) {
                    console.error(err);
                    toast.error("Upload ảnh thất bại");
                  } finally {
                    setUploadingImg(false);
                  }
                }}
              />

              {/* Upload box */}
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center h-40 w-full
                 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer
                 transition
                 hover:border-blue-500
                 bg-gray-50"
              >
                {uploadingImg ? (
                  <p className="text-blue-600 font-medium animate-pulse">
                    Đang tải ảnh...
                  </p>
                ) : formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="logo preview"
                    className="h-28 object-contain"
                  />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" />

                    <p className="text-sm text-gray-600">
                      Click để tải logo hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WEBP (tối đa 2MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex flex-col lg:grid grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label className="font-medium text-gray-700">Số điện thoại</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="0123456789"
                required
              />
            </div>
            {/* Address */}
            <div>
              <label className="font-medium text-gray-700">Địa chỉ</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="123 Nguyễn Văn A, Q1"
                required
              />
            </div>
          </div>

          <div className="flex flex-col lg:grid grid-cols-2 gap-6">
            {/* Open Hours */}
            <div>
              <label className="font-medium text-gray-700">Giờ mở cửa</label>
              <input
                type="time"
                name="openHours"
                value={formData.openHours}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                required
              />
            </div>

            {/* Close Hours */}
            <div>
              <label className="font-medium text-gray-700">Giờ đóng cửa</label>
              <input
                type="time"
                name="closeHours"
                value={formData.closeHours}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex flex-col lg:grid grid-cols-3 gap-6">
            {/* Bank Name */}
            <div>
              <label className="font-medium text-gray-700">Ngân hàng</label>
              <select
                name="nameBank"
                value={formData.nameBank}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md
             bg-white
             focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  -- Chọn ngân hàng --
                </option>

                {BANK_LIST.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            {/* Bank Number */}
            <div>
              <label className="font-medium text-gray-700">Số tài khoản</label>
              <input
                name="bankNumber"
                value={formData.bankNumber}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="123456789"
                required
              />
            </div>

            {/* Bank Holder */}
            <div className="">
              <label className="font-medium text-gray-700">
                Tên chủ tài khoản
              </label>
              <input
                name="bankAccountHolderName"
                value={formData.bankAccountHolderName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
          </div>
          {/* Submit */}
          <div className=" md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full lg:w-fi px-8 py-3 rounded-md bg-blue-600 text-white font-semibold
                         hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký nhà hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterInforTenant;
