import { useState, useEffect } from "react";
import Overlay from "../common/Overlay";
import toast from "react-hot-toast";
import accountApi from "../../api/accountApi";
import tableApi from "../../api/tableApi";
import { X, Mail, Lock, UserCheck } from "lucide-react";

function AddStaffAccount({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STAFF");
  const [loading, setLoading] = useState(false);

  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);

  useEffect(() => {
    if (role !== "STAFF") return;

    const fetchTables = async () => {
      try {
        const res = await tableApi.getActiveTable();
        setTables(res.result || []);
      } catch (err) {
        console.error("Load tables error", err);
        toast.error("Không tải được danh sách bàn");
      }
    };

    fetchTables();
  }, [role]);

  const toggleTable = (tableId) => {
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId],
    );
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không trùng khớp");
      return;
    }

    if (role === "STAFF" && selectedTables.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 bàn cho nhân viên phục vụ");
      return;
    }

    try {
      setLoading(true);

      const payload =
        role === "STAFF"
          ? {
              username: email,
              password,
              isEmployee: true,
              restaurantTableId: selectedTables,
            }
          : {
              username: email,
              password,
              isEmployee: true,
            };

      await accountApi.addStaff(role, payload);

      toast.success("Thêm nhân viên thành công");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Thêm nhân viên thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-50">
        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 w-full max-w-md shadow-2xl border border-blue-100">
          {/* Header */}
          <div className="border-b-2 border-blue-100 pb-4 sm:pb-5 mb-6 flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl font-bold">
              Thêm tài khoản nhân viên
            </h3>
            <button
              onClick={onClose}
              disabled={loading}
              className="
                w-8 h-8 flex items-center justify-center rounded-lg
                text-gray-400 hover:bg-red-100 hover:text-red-600
                transition-all duration-300 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-blue-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-blue-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-blue-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-sm font-bold">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserCheck
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setSelectedTables([]);
                  }}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-blue-200 rounded-xl text-sm"
                >
                  <option value="STAFF">Phục vụ</option>
                  <option value="KITCHEN_STAFF">Đầu bếp</option>
                </select>
              </div>
            </div>

            {/* Tables – chỉ STAFF */}
            {role === "STAFF" && (
              <div className="space-y-2">
                <label className="block text-sm font-bold">
                  Bàn phục vụ{" "}
                  <span className="text-gray-400">(có thể chọn nhiều)</span>
                </label>

                <div className="max-h-40 overflow-y-auto border-2 border-blue-200 rounded-xl p-3 space-y-2">
                  {tables.map((table) => (
                    <label
                      key={table.tableId}
                      className="flex items-center gap-3 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(table.tableId)}
                        onChange={() => toggleTable(table.tableId)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>
                        {table.tableName}
                        <span className="text-gray-400">
                          {" "}
                          – {table.section} – {table.capacity} chỗ
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-7 pt-5 border-t-2 border-blue-100">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border-2 border-gray-300 
              text-gray-700 font-medium text-sm hover:border-gray-400 hover:bg-gray-100 
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-linear-to-r 
              from-blue-600 to-blue-700 text-white font-medium text-sm border-2 border-blue-600 
              hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-300 shadow-sm cursor-pointer"
            >
              {loading ? "Đang thêm..." : "Thêm nhân viên"}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export default AddStaffAccount;
