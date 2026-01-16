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

  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    <div className="col-span-12 bg-linear-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <Navigation />

      {/* Content */}
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100">
          {/* Header + Search + Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Quản lý tài khoản
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-2">
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
                  className="w-full border-2 border-blue-200 rounded-lg py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-200 transition-all duration-200 bg-white placeholder-gray-400"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                onClick={() => setIsOpenAddAccount(true)}
                className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 active:translate-y-0 whitespace-nowrap"
              >
                <Plus size={20} strokeWidth={2.5} />
                <span className="text-sm sm:text-base">Thêm tài khoản</span>
              </button>
            </div>
          </div>

          {/* Table responsive */}
          <div className="overflow-x-auto rounded-xl border border-blue-100">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-linear-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">
                    ID
                  </th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">
                    Nhà hàng
                  </th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">
                    Email Admin
                  </th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">
                    Ngày tạo
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((acc, idx) => (
                    <tr
                      key={acc.id}
                      onClick={() => handleSelectTenant(acc.tenant)}
                      className={`border-b border-blue-100 transition-all duration-200 cursor-pointer group ${
                        idx % 2 === 0 ? "bg-white" : "bg-blue-50/50"
                      } hover:bg-blue-100 hover:shadow-md`}
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {acc.id}
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                        {acc.tenant?.nameTenant}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {acc.username}
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {acc.createdAt}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-12 text-gray-400 italic text-base"
                    >
                      Không tìm thấy kết quả phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Row Count */}
          <div className="mt-6 text-right text-sm text-gray-500">
            Hiển thị{" "}
            <span className="font-semibold text-gray-700">
              {filteredAccounts.length}
            </span>{" "}
            kết quả
          </div>
        </div>
      </div>

      {isOpenDetail && (
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
