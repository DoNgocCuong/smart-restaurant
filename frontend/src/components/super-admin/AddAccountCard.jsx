import { useState } from "react";
import InputField from "../common/InputField";
import { X } from "lucide-react";

function AddAccountCard({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email không được để trống";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // TODO: call API tạo account
    console.log({ email, password });

    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* popup */}
      <div className="relative bg-white rounded-xl p-6 w-[430px] shadow-lg">
        {/* header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Tạo tài khoản Admin</h1>
            <p className="text-sm text-gray-500">
              Thêm mới tài khoản quản lý của nhà hàng
            </p>
          </div>
          <button onClick={onClose} className="rounded-sm p-1 hover:bg-red-200">
            <X />
          </button>
        </div>

        {/* form */}
        <div className="grid gap-3">
          <InputField
            label="Email"
            type="email"
            placeholder="newemail@gmail.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
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

        {/* actions */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Tạo tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAccountCard;
