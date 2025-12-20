import { useContext, useEffect, useState } from "react";

import Logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext";

import AddAccountCard from "../../components/super-admin/AddAccountCard";

import { ChevronDown, LogOut, Pencil, Unlock, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
const mock_accounts = [
  {
    id: "#001",
    restaurant: "La Casa Bella",
    email: "admin1@restaurant.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "#002",
    restaurant: "La Casa Bella",
    email: "admin1@restaurant.com",
    status: "inactive",
    createdAt: "2024-01-15",
  },
  {
    id: "#003",
    restaurant: "La Casa Bella",
    email: "admin1@restaurant.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "#004",
    restaurant: "La Casa Bella",
    email: "admin1@restaurant.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "#005",
    restaurant: "La Casa Bella",
    email: "admin1@restaurant.com",
    status: "inactive",
    createdAt: "2024-01-15",
  },
];

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const { role, logout } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const [isOpenAddAccount, setIsOpenAddAccount] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    setAccounts(mock_accounts);
    setUserName(localStorage.getItem("userName") || "");
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.clear();
  };

  const handleResetPassword = (id) => {
    // Gọi API reset password theo id

    toast.success(`Reset mật khẩu của ${id} thành công`);
  };

  const handleLockAccount = (id) => {
    // Gọi API khóa tài khoản

    toast.success(`Khóa tài khoản ${id} thành công`);
  };

  const handleUnlockAccount = (id) => {
    // Gọi API mở khóa tài khoản

    toast.success(`Mở khóa tài khoản ${id} thành công`);
  };

  return (
    <div className="col-span-12 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white h-16 shadow-sm py-10 px-20 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt=""
            className="w-10 h-10 flex items-center justify-center"
          />
          <div>
            <h1 className="font-bold leading-tight">Quản trị hệ thống</h1>
            <p className="text-sm text-gray-500 leading-tight">
              Quản lý tài khoản Admin của nhà hàng
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center cursor-pointer select-none"
          >
            {/* Username */}
            <div className="mr-3 hidden md:flex flex-col leading-tight">
              <span className="font-semibold text-sm text-right">
                {userName}
              </span>
              <span className="text-xs text-gray-500 text-right">{role}</span>
            </div>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
              {userName ? userName.charAt(0).toUpperCase() : "👤"}{" "}
            </div>
            <ChevronDown />
          </div>

          {/* Dropdown */}
          {openMenu && (
            <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-3"
              >
                <LogOut size={16} /> <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Card */}
      <div className="py-10 px-20">
        <div className="bg-white rounded-xl shadow p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
              <p className="text-gray-500">
                Quản lý các tài khoản Admin của nhà hàng
              </p>
            </div>

            <button
              onClick={() => {
                setIsOpenAddAccount(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              <span className="text-lg">＋</span>
              Thêm tài khoản
            </button>
          </div>

          {/* Table */}
          <div className=" h-fit">
            <table className="w-full border-collapse h-fit">
              <thead>
                <tr className="border-b border-b-gray-300 text-gray-500 text-sm">
                  <th className="text-left py-3 px-2">ID</th>
                  <th className="text-left py-3 px-2">Nhà hàng</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Trạng thái</th>
                  <th className="text-left py-3 px-2">Ngày tạo</th>
                  <th className="text-center py-3 px-2">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {accounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-b border-b-gray-300 hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-2 font-semibold">{acc.id}</td>
                    <td className="py-3 px-2">{acc.restaurant}</td>
                    <td className="py-3 px-2 font-semibold">{acc.email}</td>
                    <td
                      className={`py-3 px-2 font-semibold ${
                        acc.status == "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {acc.status == "active" ? "Hoạt động" : "Bị khóa"}
                    </td>
                    <td className="py-3 px-2">{acc.createdAt}</td>
                    <td className="py-3 px-2">
                      <div className="flex justify-center gap-2">
                        {/* Đặt lại mật khẩu */}
                        <div className="relative">
                          <button
                            onMouseEnter={() =>
                              setHoveredButton({ id: acc.id, type: "reset" })
                            }
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => handleResetPassword(acc.id)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-md hover:bg-gray-200 cursor-pointer"
                          >
                            <RefreshCcw size={16} />
                          </button>

                          {/* Tooltip */}
                          {hoveredButton?.id === acc.id &&
                            hoveredButton?.type === "reset" && (
                              <div
                                className="z-20 absolute top-full mt-2 left-1/2 -translate-x-1/2 
          bg-gray-800 text-white text-sm rounded-md px-2 py-1 
          whitespace-nowrap shadow-md animate-fadeIn pointer-events-none"
                              >
                                Đặt lại mật khẩu
                              </div>
                            )}
                        </div>

                        {/* Khóa */}
                        <div className="relative">
                          <button
                            onMouseEnter={() =>
                              setHoveredButton({ id: acc.id, type: "lock" })
                            }
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => handleLockAccount(acc.id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                          >
                            <Unlock size={16} />
                          </button>

                          {/* Tooltip */}
                          {hoveredButton?.id === acc.id &&
                            hoveredButton?.type === "lock" && (
                              <div
                                className="z-20 absolute top-full mt-2 left-1/2 -translate-x-1/2 
          bg-red-700 text-white text-sm rounded-md px-2 py-1 
          whitespace-nowrap shadow-md animate-fadeIn pointer-events-none"
                              >
                                Khóa tài khoản
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isOpenAddAccount && (
        <AddAccountCard
          onClose={() => {
            setIsOpenAddAccount(false);
          }}
        />
      )}
    </div>
  );
}

export default AccountManagement;
