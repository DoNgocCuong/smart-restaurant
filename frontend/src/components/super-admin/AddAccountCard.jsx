import { useState } from "react";
import InputField from "../common/InputField";
import Overlay from "../common/Overlay";
import { X, Mail, Lock, Check } from "lucide-react";
import toast from "react-hot-toast";
import accountApi from "../../api/accountApi";

function AddAccountCard({ onClose }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const newErrors = {};

    if (!username) newErrors.username = "Email không được để trống";
    if (!password) newErrors.password = "Mật khẩu không được để trống";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const res = await accountApi.createAccountAdmin({ username, password });
      console.log(res);
      toast.success("Thêm tài khoản admin thành công");
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error("Tạo tài khoản thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] mx-4 p-6 sm:p-8 animate-fadeIn border border-blue-100">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Tạo tài khoản Admin
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Thêm mới tài khoản quản lý của nhà hàng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-500" strokeWidth={2} />
                Email
              </div>
            </label>
            <InputField
              type="email"
              placeholder="newadmin@gmail.com"
              value={username}
              onChange={setUserName}
              error={errors.username}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-blue-500" strokeWidth={2} />
                Mật khẩu
              </div>
            </label>
            <InputField
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Check size={18} className="text-blue-500" strokeWidth={2} />
                Xác nhận mật khẩu
              </div>
            </label>
            <InputField
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-blue-100">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 flex justify-center items-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 font-semibold active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang tạo...
              </>
            ) : (
              "Tạo tài khoản"
            )}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

export default AddAccountCard;
