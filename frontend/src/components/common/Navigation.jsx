import Logo from "../../assets/images/logo.png";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";

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
    "px-2 py-1 rounded-lg border-b-2 border-[#5B94FF]/0 cursor-pointer hover:border-[#5B94FF]/80 hover:bg-[#5B94FF]/10 transition-colors";

  const focusLink = "border-[#5B94FF]/50 font-semibold";

  const mobileLinkStyle =
    "block px-4 py-3 rounded-lg hover:bg-[#5B94FF]/10 transition-colors";

  const navItems = [
    { to: "dashboard", label: "Trang chủ" },
    { to: "menu-management", label: "Thực đơn" },
    { to: "table-management", label: "Bàn & QR" },
    { to: "order-management", label: "Đơn hàng" },
    { to: "revenue", label: "Doanh thu" },
    { to: "staff-management", label: "Nhân viên" },
  ];

  return (
    <header className="bg-white shadow-sm grid grid-cols-12 sticky top-0 z-50">
      <div className="col-start-2 col-end-12 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo & Title */}
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src={Logo}
              alt="Logo"
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold leading-tight text-sm md:text-base">
                Quản lý nhà hàng
              </h1>
              <p className="text-xs md:text-sm text-gray-500 leading-tight">
                Quản lý thông tin nội bộ của nhà hàng
              </p>
            </div>
            <h1 className="sm:hidden font-bold text-sm">Quản lý nhà hàng</h1>
          </div>

          {/* Center - Desktop Navigation (hidden on mobile) */}
          {role !== "SUPER_ADMIN" && !pathname.includes("tenant-create") && (
            <nav className="hidden lg:flex gap-3">
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="relative hidden lg:block">
              <div
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center cursor-pointer select-none"
              >
                <div className="mr-3 flex flex-col leading-tight">
                  <span className="font-semibold text-sm text-right">
                    {userName}
                  </span>
                  <span className="text-xs text-gray-500 text-right">
                    {role}
                  </span>
                </div>
                <div className="w-10 md:h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-base">
                  {userName ? userName.charAt(0).toUpperCase() : "👤"}
                </div>
                <ChevronDown size={20} />
              </div>

              {/* Desktop Dropdown */}
              {openMenu && (
                <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-3 rounded-lg"
                  >
                    <LogOut size={16} /> <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-2 border-t border-gray-100 pt-4">
            {/* User info section */}
            <div className="px-4 py-2 mb-2 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm">{userName}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>

            {/* Navigation links */}
            {mobileMenuOpen &&
              role !== "SUPER_ADMIN" &&
              !pathname.includes("tenant-create") && (
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${mobileLinkStyle} ${
                        isActive(item.to)
                          ? "bg-[#5B94FF]/10 border-l-4 border-[#5B94FF]"
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
              className="w-full text-left px-4 py-3 mt-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 rounded-lg border-t border-gray-100 pt-4"
            >
              <LogOut size={16} /> <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navigation;
