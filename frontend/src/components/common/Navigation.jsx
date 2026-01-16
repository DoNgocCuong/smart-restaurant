import Logo from "../../assets/images/logo.png";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { role, logout } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "");
  }, []);

  const handleLogout = async () => {
    try {
      // gọi API logout (nếu backend cần)
      await authApi.logout();
    } catch (error) {
      // logout vẫn tiếp tục dù API fail (token hết hạn, 401, v.v.)
      console.warn("Logout API failed:", error);
    } finally {
      // clear auth state
      logout();
      localStorage.clear();

      // về trang login
      navigate("/login", { replace: true });
    }
  };

  const isActive = (keyword) => pathname.includes(keyword);

  const styleLink =
    "px-3 py-2 rounded-lg border-b-2 border-blue-500/0 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700 hover:text-blue-600";

  const focusLink = "border-blue-500 bg-blue-50 text-blue-600 font-semibold";

  const mobileLinkStyle =
    "block px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-gray-700";

  const navItems = [
    { to: "dashboard", label: "Trang chủ" },
    { to: "menu-management", label: "Thực đơn" },
    { to: "table-management", label: "Bàn & QR" },
    { to: "order-management", label: "Đơn hàng" },
    { to: "revenue", label: "Doanh thu" },
    { to: "staff-management", label: "Nhân viên" },
  ];

  return (
    <header className="bg-linear-to-r from-white to-blue-50 shadow-md sticky top-0 z-50 border-b border-blue-100">
      <div className="grid grid-cols-12">
        <div className="col-start-2 col-end-12 py-4 md:py-5">
          <div className="flex items-center justify-between">
            {/* Left - Logo & Title */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-6 h-6 md:w-8 md:h-8 filter brightness-0 invert"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                  Quản lý nhà hàng
                </h1>
                <p className="text-xs md:text-sm text-gray-500 leading-tight">
                  Quản lý thông tin nội bộ của nhà hàng
                </p>
              </div>
              <h1 className="sm:hidden font-bold text-gray-900 text-sm">
                Quản lý nhà hàng
              </h1>
            </div>

            {/* Center - Desktop Navigation (hidden on mobile) */}
            {role !== "SUPER_ADMIN" && !pathname.includes("tenant-create") && (
              <nav className="hidden lg:flex gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`${styleLink} ${
                      isActive(item.to) ? focusLink : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Right - User Menu & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-blue-100 rounded-lg transition-all duration-200 text-gray-700"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="relative hidden lg:block">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 group"
                >
                  <div className="flex flex-col leading-tight text-right">
                    <span className="font-semibold text-sm text-gray-900">
                      {userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {role === "SUPER_ADMIN" ? "Quản trị viên" : role}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                    {userName ? userName.charAt(0).toUpperCase() : "👤"}
                  </div>
                  <ChevronDown
                    size={20}
                    className="text-gray-600 group-hover:text-blue-600 transition-colors"
                  />
                </button>

                {/* Desktop Dropdown */}
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-blue-100 bg-blue-50">
                      <p className="font-semibold text-sm text-gray-900">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {role === "SUPER_ADMIN" ? "Quản trị viên" : role}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 transition-all duration-200 font-medium"
                    >
                      <LogOut size={18} strokeWidth={2} />{" "}
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-3 border-t border-blue-100 pt-4 space-y-3">
              {/* User info section */}
              <div className="px-4 py-3 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="font-semibold text-sm text-gray-900">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {role === "SUPER_ADMIN" ? "Quản trị viên" : role}
                </p>
              </div>

              {/* Navigation links */}
              {role !== "SUPER_ADMIN" &&
                !pathname.includes("tenant-create") && (
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`${mobileLinkStyle} ${
                          isActive(item.to)
                            ? "bg-blue-100 border-l-4 border-blue-500 text-blue-600"
                            : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 mt-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 rounded-lg border-t border-blue-100 pt-4 font-medium transition-all duration-200"
              >
                <LogOut size={18} strokeWidth={2} /> <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
