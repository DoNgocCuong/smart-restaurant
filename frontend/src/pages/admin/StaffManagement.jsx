import { useEffect, useState } from "react";
import accountApi from "../../api/accountApi";
import toast from "react-hot-toast";
import { Plus, Users, CheckCircle2, XCircle } from "lucide-react";
import AddStaffAccount from "../../components/admin/AddStaffAccount";

function StaffManagement() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await accountApi.getAllStaff();
      setStaffs(res.result || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const renderRole = (roles) => {
    if (!roles || roles.length === 0) return "—";

    const roleMap = {
      STAFF: "Phục vụ",
      KITCHEN_STAFF: "Đầu bếp",
    };

    return roles.map((r) => roleMap[r.name] || r.name).join(", ");
  };

  return (
    <div className="col-start-2 col-end-12 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 lg:p-7 bg-white rounded-3xl border-2 border-blue-100 shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users size={28} className="text-blue-600" strokeWidth={2} />
            Quản lý nhân viên
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Danh sách tài khoản và vai trò của nhân viên
          </p>
        </div>
        <button
          className="
            flex items-center justify-center gap-2
            px-5 py-2.5
            text-white
            bg-linear-to-r from-blue-600 to-blue-700
            rounded-xl
            hover:from-blue-700 hover:to-blue-800
            border-2 border-blue-600
            shadow-sm
            transition-all duration-300
            font-medium
            text-sm
            cursor-pointer
            w-full sm:w-auto
          "
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} strokeWidth={2.5} />
          Thêm tài khoản
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-6 lg:p-7 bg-white rounded-3xl border-2 border-blue-100 shadow-sm">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : staffs.length === 0 ? (
          <div className="py-16 text-center">
            <Users
              size={48}
              className="text-blue-300 mx-auto mb-3"
              strokeWidth={1}
            />
            <p className="text-gray-400 font-medium">Chưa có nhân viên</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-2 border-blue-100">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="text-left text-sm font-bold text-blue-700 tracking-wide bg-linear-to-r from-blue-50 to-blue-50 uppercase">
                  <th className="px-4 sm:px-6 py-4 border-b-2 border-blue-100">
                    #
                  </th>
                  <th className="px-4 sm:px-6 py-4 border-b-2 border-blue-100">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-4 border-b-2 border-blue-100">
                    Vai trò
                  </th>
                  <th className="px-4 sm:px-6 py-4 border-b-2 border-blue-100">
                    Kích hoạt
                  </th>
                  <th className="px-4 sm:px-6 py-4 border-b-2 border-blue-100">
                    Ngày tạo
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-100">
                {staffs.map((staff, index) => (
                  <tr
                    key={staff.username}
                    className="text-sm text-gray-700 transition-colors duration-200 hover:bg-blue-50"
                  >
                    <td className="px-4 sm:px-6 py-4 font-semibold text-gray-800">
                      {index + 1}
                    </td>

                    <td className="px-4 sm:px-6 py-4 font-semibold text-gray-800">
                      {staff.username}
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className="
                        inline-block
                        px-3 py-1.5
                        text-blue-700
                        text-xs
                        font-bold
                        bg-blue-100
                        rounded-full
                        border border-blue-200
                      "
                      >
                        {renderRole(staff.roles)}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        {staff.is_active ? (
                          <>
                            <CheckCircle2
                              size={16}
                              className="text-emerald-600"
                              strokeWidth={2.5}
                            />
                            <span className="text-emerald-600 font-bold">
                              Hoạt động
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle
                              size={16}
                              className="text-red-600"
                              strokeWidth={2.5}
                            />
                            <span className="text-red-600 font-bold">
                              Bị khóa
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-gray-600">
                      {new Date(staff.createAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        {!loading && staffs.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-blue-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 font-medium">
                Tổng nhân viên
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {staffs.length}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {staffs.filter((s) => s.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              <p className="text-xs text-red-600 font-medium">Bị khóa</p>
              <p className="text-2xl font-bold text-red-700">
                {staffs.filter((s) => !s.is_active).length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal AddStaffAccount */}
      {showAddModal && (
        <AddStaffAccount
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchStaffs();
          }}
        />
      )}
    </div>
  );
}

export default StaffManagement;
