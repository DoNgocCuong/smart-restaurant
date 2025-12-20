import { useState } from "react";
import InputField from "../common/InputField";
import Overlay from "../common/Overlay";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import accountApi from "../../api/accountApi";

function AddAccountCard({ onClose }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const newErrors = {};

    if (!username) newErrors.username = "Email không được để trống";
    if (!password) newErrors.password = "Mật khẩu không được để trống";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await accountApi.createAccountAdmin({ username, password });
      console.log(res);
      toast.success("Thêm tài khoản admin thành công");
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error("Tạo tài khoản thất bại");
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[430px] mx-4 p-4 sm:p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Tạo tài khoản Admin
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Thêm mới tài khoản quản lý của nhà hàng
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm p-1 hover:bg-red-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="grid gap-3">
          <InputField
            label="Email"
            type="email"
            placeholder="newadmin@gmail.com"
            value={username}
            onChange={setUserName}
            error={errors.username}
            required
          />

          <InputField
            label="Mật khẩu"
            type="password"
            placeholder="●●●●●●●●"
            value={password}
            onChange={setPassword}
            error={errors.password}
            required
          />

          <InputField
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="●●●●●●●●"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Tạo tài khoản
          </button>
        </div>
      </div>
    </Overlay>
  );
}

export default AddAccountCard;
