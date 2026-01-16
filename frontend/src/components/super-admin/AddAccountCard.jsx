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
      <div className="mx-4 p-6 w-full max-w-[500px] bg-white rounded-2xl border-blue-100 shadow-2xl animate-fadeIn border sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-transparent bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text sm:text-3xl">
              Tạo tài khoản Admin
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Thêm mới tài khoản quản lý của nhà hàng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
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
            <label className="block mb-2 text-sm font-semibold text-gray-700">
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
            <label className="block mb-2 text-sm font-semibold text-gray-700">
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
            className="flex-1 px-5 py-3 text-gray-700 font-semibold rounded-lg border-2 border-gray-200 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 flex justify-center items-center gap-2 px-5 py-3 text-white font-semibold bg-linear-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
