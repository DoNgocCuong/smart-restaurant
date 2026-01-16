import { useEffect, useState } from "react";
import accountApi from "../../api/accountApi";
import toast from "react-hot-toast";
import AddStaffAccount from "../../components/admin/AddStaffAccount";

function StaffManagement() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // state modal

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
      <div className="flex justify-between items-center p-6 bg-white rounded-xl border-gray-200 shadow-md border">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý nhân viên</h2>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowAddModal(true)}
        >
          Thêm tài khoản
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6 bg-white rounded-xl border-gray-200 shadow-md border">
        {loading ? (
          <div className="py-12 text-center text-gray-500 italic">
            Đang tải dữ liệu...
          </div>
        ) : staffs.length === 0 ? (
          <div className="py-12 text-center text-gray-500 italic">
            Chưa có nhân viên
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="text-left text-sm text-gray-600 tracking-wide bg-gray-50 uppercase">
                  <th className="px-5 py-3 border-b border-gray-200">#</th>
                  <th className="px-5 py-3 border-b border-gray-200">Email</th>
                  <th className="px-5 py-3 border-b border-gray-200">
                    Vai trò
                  </th>
                  <th className="px-5 py-3 border-b border-gray-200">
                    Kích hoạt
                  </th>
                  <th className="px-5 py-3 border-b border-gray-200">
                    Ngày tạo
                  </th>
                </tr>
              </thead>

              <tbody>
                {staffs.map((staff, index) => (
                  <tr
                    key={staff.username}
                    className="text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="px-5 py-3 border-b border-gray-200">
                      {index + 1}
                    </td>

                    <td className="px-5 py-3 font-medium border-b border-gray-200">
                      {staff.username}
                    </td>

                    <td className="px-5 py-3 border-b border-gray-200">
                      <span className="inline-block px-2 py-1 text-blue-800 text-xs font-semibold bg-blue-100 rounded-full">
                        {renderRole(staff.roles)}
                      </span>
                    </td>

                    <td className="px-5 py-3 border-b border-gray-200">
                      {staff.is_active ? (
                        <span className="text-green-600 font-semibold">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Bị khóa
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3 border-b border-gray-200">
                      {new Date(staff.createAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal AddStaffAccount */}
      {showAddModal && (
        <AddStaffAccount
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchStaffs(); // refresh danh sách sau khi thêm
          }}
        />
      )}
    </div>
  );
}

export default StaffManagement;
