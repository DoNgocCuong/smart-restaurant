import { useContext, useEffect, useState, useMemo } from "react";
import Logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext";
import { ChevronDown, LogOut, Search, Plus } from "lucide-react";
import toast from "react-hot-toast";
import accountApi from "../../api/accountApi";
import DetailAdminAccountModal from "../../components/super-admin/DetailAdminAccountModal";
import AddAccountCard from "../../components/super-admin/AddAccountCard";
import Fuse from "fuse.js";
import Navigation from "../../components/common/Navigation";
function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenAddAccount, setIsOpenAddAccount] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await accountApi.getAllAdminAccount();
      if (res.code === "1000") {
        const mapped = res.result.map((item, index) => ({
          id: `#${index + 1}`,
          username: item.username,
          tenant: item.tenant,
          createdAt: new Date(item.createAt).toLocaleDateString("vi-VN"),
        }));
        setAccounts(mapped);
      } else {
        toast.error("Không thể lấy danh sách tài khoản");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách tài khoản");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [isOpenAddAccount]);

  const handleSelectTenant = (tenant) => {
    setSelectedTenant(tenant);
    setIsOpenDetail(true);
  };

  const fuse = useMemo(() => {
    return new Fuse(accounts, {
      keys: ["tenant.nameTenant"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    if (!searchTerm.trim()) return accounts;
    return fuse.search(searchTerm).map((r) => r.item);
  }, [searchTerm, accounts, fuse]);

  return (
    <div className="col-span-12 bg-slate-50 min-h-screen">
      {/* Header */}
      <Navigation />
      {/* Content */}
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-20">
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          {/* Header + Search + Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Quản lý tài khoản
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Quản lý các tài khoản Admin của nhà hàng
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Tìm theo tên nhà hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                onClick={() => setIsOpenAddAccount(true)}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                <Plus size={18} />
                <span className="text-sm sm:text-base">Thêm tài khoản</span>
              </button>
            </div>
          </div>

          {/* Table responsive */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-b-gray-300 text-gray-500 text-sm">
                  <th className="text-left py-3 px-2">ID</th>
                  <th className="text-left py-3 px-2">Nhà hàng</th>
                  <th className="text-left py-3 px-2">Email Admin</th>
                  <th className="text-left py-3 px-2">Ngày tạo</th>
                </tr>
              </thead>

              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((acc) => (
                    <tr
                      key={acc.id}
                      onClick={() => handleSelectTenant(acc.tenant)}
                      className="border-b border-b-gray-300 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <td className="py-3 px-2 font-semibold">{acc.id}</td>
                      <td className="py-3 px-2">{acc.tenant?.nameTenant}</td>
                      <td className="py-3 px-2 font-semibold">
                        {acc.username}
                      </td>
                      <td className="py-3 px-2">{acc.createdAt}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Không tìm thấy kết quả phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isOpenDetail && selectedTenant && (
        <DetailAdminAccountModal
          tenant={selectedTenant}
          onClose={() => setIsOpenDetail(false)}
        />
      )}

      {isOpenAddAccount && (
        <AddAccountCard
          onClose={() => {
            setIsOpenAddAccount(false);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
}

export default AccountManagement;
