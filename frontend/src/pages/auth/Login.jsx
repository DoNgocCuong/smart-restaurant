import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import tenantApi from "../../api/tenantApi";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Lock, X } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saveAccount, setSaveAccount] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Load danh sách tài khoản đã lưu khi component mount
  useEffect(() => {
    const accounts = localStorage.getItem("savedAccounts");
    if (accounts) {
      try {
        setSavedAccounts(JSON.parse(accounts));
      } catch (err) {
        console.error("Error parsing saved accounts:", err);
        setSavedAccounts([]);
      }
    }
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc danh sách tài khoản theo input của người dùng
  const filteredAccounts = savedAccounts.filter((account) =>
    account.toLowerCase().includes(email.toLowerCase())
  );

  const addSavedAccount = (newEmail, newPassword) => {
    const updated = savedAccounts.filter((acc) => acc !== newEmail);
    updated.unshift(newEmail);
    if (updated.length > 5) updated.pop();
    setSavedAccounts(updated);
    localStorage.setItem("savedAccounts", JSON.stringify(updated));
  };

  const removeSavedAccount = (accountToRemove) => {
    const updated = savedAccounts.filter((acc) => acc !== accountToRemove);
    setSavedAccounts(updated);
    localStorage.setItem("savedAccounts", JSON.stringify(updated));
  };

  const selectSavedAccount = (selectedEmail) => {
    setEmail(selectedEmail);
    setPassword("");
    setSaveAccount(true);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await authApi.login({
        userName: email,
        password,
      });

      localStorage.setItem("userName", email);
      const accessToken = res.result.acessToken;

      await login(accessToken);

      const role = localStorage.getItem("role");

      if (role === "TENANT_ADMIN") {
        try {
          await tenantApi.getTenantProfile();
        } catch (profileError) {
          if (profileError?.response?.status === 403) {
            toast.error("Bạn cần tạo nhà hàng trước khi sử dụng hệ thống.");
            navigate("/tenant-admin/tenant-create", { replace: true });
            return;
          }
          throw profileError;
        }
      }

      // Lưu tài khoản nếu tick "Lưu tài khoản"
      if (saveAccount) {
        addSavedAccount(email, password);
      }

      if (role === "SUPER_ADMIN") {
        navigate("/super-admin/accounts", { replace: true });
      } else if (role === "TENANT_ADMIN") {
        navigate(`/tenant-admin/dashboard`, { replace: true });
      } else if (role === "STAFF") {
        navigate(`/waiter/dashboard`, { replace: true });
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
      toast.error("Không thể đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-blue-100">
        <div className="flex flex-col gap-2">
          <h1 className="font-extrabold text-3xl text-center bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            Hệ thống quản lý nhà hàng
          </h1>
          <h2 className="font-bold text-lg text-center text-gray-700">
            Đăng nhập
          </h2>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="flex flex-col gap-2 relative">
            <label className="font-semibold text-gray-700 text-sm">Email</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={20} strokeWidth={2} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(false);
                  if (savedAccounts.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onFocus={() => {
                  if (savedAccounts.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                required
                className="w-full pl-10 pr-4 border-2 border-blue-200 h-11 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200 transition-all duration-200 placeholder-gray-400"
                placeholder="Nhập email của bạn"
              />
            </div>

            {/* Dropdown danh sách tài khoản */}
            {showSuggestions && filteredAccounts.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
              >
                <div className="p-2">
                  <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">
                    Tài khoản đã lưu
                  </div>
                  {filteredAccounts.map((account, index) => (
                    <div
                      key={index}
                      onClick={() => selectSavedAccount(account)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                          <User
                            size={16}
                            className="text-white"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate text-sm">
                            {account}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedAccount(account);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                      >
                        <X
                          size={16}
                          className="text-red-500"
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-sm">
              Mật khẩu
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} strokeWidth={2} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(false);
                }}
                required
                className="w-full pl-10 pr-12 border-2 border-blue-200 h-11 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200 transition-all duration-200 placeholder-gray-400"
                placeholder="Nhập mật khẩu của bạn"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer p-1 hover:bg-blue-50 rounded"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-red-600 text-sm font-medium">
                ⚠️ {errorMessage}
              </p>
            </div>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveAccount"
              checked={saveAccount}
              onChange={(e) => setSaveAccount(e.target.checked)}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <label
              htmlFor="saveAccount"
              className="text-sm text-gray-600 cursor-pointer hover:text-gray-700 transition-colors"
            >
              Lưu tài khoản này
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 py-3 px-4 rounded-lg font-bold text-white cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Tài khoản sử dụng hệ thống do Quản trị viên cấp. Vui lòng liên hệ
            Quản lý hệ thống nếu bạn chưa có tài khoản.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
