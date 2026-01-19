import { X, User, Phone, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import Overlay from "../common/Overlay";
import customerApi from "../../api/customerApi";
import toast from "react-hot-toast";

export default function CustomerInfoModal({ onSuccess, onClose }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !phone || !address || !gender) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      // 📤 GỬI API CẬP NHẬT THÔNG TIN KHÁCH HÀNG
      const res = await customerApi.createProfile({
        name: fullName,
        phone,
        address,
        gender,
      });

      console.log(res);
      toast.success("Thông tin của bạn được tạo thành công!");
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Có lỗi xảy ra");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      {/* MODAL */}
      <div className="p-6 w-[92%] max-w-md bg-white rounded-3xl shadow-xl animate-scaleIn sm:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Cập nhật thông tin
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 px-4 py-3 text-red-600 text-sm bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-4">
          {/* FULL NAME */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 text-gray-400 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="pl-11 pr-4 py-3 w-full bg-white text-gray-800 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* PHONE */}
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 text-gray-400 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="pl-11 pr-4 py-3 w-full bg-white text-gray-800 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* ADDRESS */}
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 text-gray-400 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
              className="pl-11 pr-4 py-3 w-full bg-white text-gray-800 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* GENDER */}
          <div className="relative">
            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 text-gray-400 -translate-y-1/2 pointer-events-none"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={loading}
              className="pl-4 pr-10 py-3 w-full bg-white text-gray-800 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 appearance-none cursor-pointer"
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="py-3 w-full text-white font-semibold bg-green-600 rounded-2xl hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Đang cập nhật..." : "Xác nhận"}
          </button>
        </div>

        {/* INFO */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Thông tin này là bắt buộc để hoàn thành đăng ký
        </p>
      </div>
    </Overlay>
  );
}
