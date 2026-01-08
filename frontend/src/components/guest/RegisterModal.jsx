import { useState } from "react";
import authApi from "../../api/authApi";

export default function RegisterModal({ onClose, tenantId = 1 }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await authApi.customerSignup(tenantId, formData);
      setMessage("Đăng ký thành công! 🎉");
      console.log("Signup result:", res);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] sm:w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">
          Đăng ký tài khoản
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="username"
            placeholder="Email"
            value={formData.username}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-medium transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
