import { useState } from "react";
import authApi from "../../api/authApi";
import { Eye, EyeOff, X, Mail, Lock } from "lucide-react";
import Overlay from "../common/Overlay";
const sanitizePassword = (value) => value.replace(/[^\x21-\x7E]/g, "");

export default function RegisterModal({
  onClose,
  onSuccess,
  onLoginModal,
  tenantId = 1,
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password" || name === "confirmPassword") {
      setFormData((prev) => ({
        ...prev,
        [name]: sanitizePassword(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      await authApi.customerSignup(tenantId, {
        username: formData.username,
        password: formData.password,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Đăng ký thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      {/* MODAL */}
      <div className="relative bg-white w-[92%] max-w-md rounded-3xl shadow-xl p-6 sm:p-8 animate-scaleIn">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Đăng ký
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              name="username"
              placeholder="Email"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl
                         focus:outline-none focus:ring-2 focus:ring-black/80"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-2xl
                         focus:outline-none focus:ring-2 focus:ring-black/80"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-2xl
                         focus:outline-none focus:ring-2 focus:ring-black/80"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700
                       text-white font-semibold transition disabled:opacity-60"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <button
            onClick={() => {
              onClose();
              onLoginModal?.();
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </Overlay>
  );
}
