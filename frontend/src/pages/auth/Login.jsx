import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // tránh reload trang
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="w-full bg-gray-100 h-screen flex items-start justify-center pt-20">
      <div className="bg-white w-1/2 lg:w-1/3 xl:w-1/4 rounded-2xl shadow-xl p-8 flex flex-col gap-4">
        <h1 className="font-extrabold text-2xl text-center text-[#5B94FF]">
          Restaurant Management System
        </h1>
        <h2 className="font-extrabold text-xl text-center">Tenant Login</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="w-full">
            <p className="font-bold mb-1">Email</p>
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full border border-[#5B94FF]/30 h-10 rounded-[5px] px-2 focus:outline-none focus:ring-2 focus:ring-[#5B94FF]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="w-full">
            <p className="font-bold mb-1">Mật khẩu</p>
            <input
              type="password"
              placeholder="*********"
              className="w-full border border-[#5B94FF]/30 h-10 rounded-[5px] px-2 focus:outline-none focus:ring-2 focus:ring-[#5B94FF]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="w-full flex flex-col items-center gap-2">
            <button
              type="submit"
              className="w-fit bg-[#5B94FF] py-2 px-4 rounded-[5px] font-bold text-white"
            >
              Đăng nhập
            </button>
            <Link to="/register">
              Chưa có tài khoản?{" "}
              <span className="text-[#5B94FF]">Đăng ký thuê</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
