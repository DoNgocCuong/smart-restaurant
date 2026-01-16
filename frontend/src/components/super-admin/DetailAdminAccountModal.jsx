import { X, Building2, Phone, MapPin, Clock } from "lucide-react";
import Overlay from "../../components/common/Overlay";

export default function DetailAdminAccountModal({ tenant, onClose }) {
  const details = [
    {
      label: "Tên nhà hàng",
      value: tenant?.nameTenant || "—",
      icon: Building2,
    },
    {
      label: "Số điện thoại",
      value: tenant?.phone || "—",
      icon: Phone,
    },
    {
      label: "Địa chỉ",
      value: tenant?.address || "—",
      icon: MapPin,
    },
    {
      label: "Giờ mở cửa",
      value: tenant?.openHours || "—",
      icon: Clock,
    },
    {
      label: "Giờ đóng cửa",
      value: tenant?.closeHours || "—",
      icon: Clock,
    },
  ];

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-[500px] animate-fadeIn mx-4 border border-blue-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Thông tin nhà hàng
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Xem chi tiết về nhà hàng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {!tenant ? (
          // Empty state khi chưa có thông tin
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4">
              <Building2
                size={32}
                className="text-blue-400"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-gray-600 font-semibold text-lg mb-2">
              Chưa có thông tin nhà hàng
            </p>
            <p className="text-gray-400 text-sm text-center max-w-xs">
              Nhà hàng này chưa được cấu hình. Vui lòng liên hệ quản trị viên để
              cập nhật thông tin.
            </p>
          </div>
        ) : (
          <>
            {/* Logo Section */}
            {tenant.logoUrl && (
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-200 to-blue-100 rounded-xl blur-lg opacity-50"></div>
                  <img
                    src={tenant?.logoUrl}
                    alt={tenant?.nameTenant}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-blue-200 shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Nội dung chi tiết */}
            <div className="space-y-3 sm:space-y-4">
              {details.map((detail, index) => {
                const IconComponent = detail.icon;
                return (
                  <div
                    key={index}
                    className="group p-4 rounded-xl bg-linear-to-r from-blue-50 to-white border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-blue-500 flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                        <IconComponent
                          size={20}
                          className="text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          {detail.label}
                        </p>
                        <p className="text-sm sm:text-base font-medium text-gray-900 mt-1 wrap-break-words group-hover:text-blue-600 transition-colors">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer divider */}
            <div className="mt-6 pt-6 border-t border-blue-100">
              <p className="text-xs text-gray-400 text-center">
                Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}
