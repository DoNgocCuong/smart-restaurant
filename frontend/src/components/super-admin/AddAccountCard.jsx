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

    if (!username) {
      newErrors.username = "Email không được để trống";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

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
      {/* popup */}
      <div className="bg-white rounded-xl p-6 w-[430px] shadow-lg">
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
            label="Tên tài khoản"
            type="email"
            placeholder="newadmin"
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
    </Overlay>
  );
}

export default AddAccountCard;
