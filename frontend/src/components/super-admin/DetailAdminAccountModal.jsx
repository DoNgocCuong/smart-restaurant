import { X } from "lucide-react";
import Overlay from "../../components/common/Overlay";

export default function DetailAdminAccountModal({ tenant, onClose }) {
  if (!tenant) return null;

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-[400px] animate-fadeIn mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Thông tin Tenant
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-red-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-3 text-sm sm:text-base text-gray-700">
          <div>
            <span className="font-semibold">Tên nhà hàng:</span>{" "}
            {tenant.nameTenant || "—"}
          </div>
          <div>
            <span className="font-semibold">Số điện thoại:</span>{" "}
            {tenant.phone || "—"}
          </div>
          <div>
            <span className="font-semibold">Địa chỉ:</span>{" "}
            {tenant.address || "—"}
          </div>
          <div>
            <span className="font-semibold">Giờ mở cửa:</span>{" "}
            {tenant.openHours || "—"}
          </div>
          <div>
            <span className="font-semibold">Giờ đóng cửa:</span>{" "}
            {tenant.closeHours || "—"}
          </div>

          {tenant.logoUrl && (
            <div className="mt-4 flex justify-center">
              <img
                src={tenant.logoUrl}
                alt="Logo"
                className="w-24 sm:w-28 h-24 sm:h-28 rounded-sm object-cover border"
              />
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
}
