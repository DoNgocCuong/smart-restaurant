import toast from "react-hot-toast";
import tenantApi from "../../api/tenantApi";
import { useState, useEffect } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

function Dashboard() {
  const [tenantProfile, setTenantProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await tenantApi.getTenantProfile();
        setTenantProfile(res.result);
      } catch (err) {
        toast.error("Đã xảy ra lỗi khi lấy profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-linear-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="h-40 bg-linear-to-r from-blue-100 to-blue-50 rounded-3xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white rounded-3xl shadow-sm animate-pulse" />
          <div className="h-32 bg-white rounded-3xl shadow-sm animate-pulse" />
          <div className="h-32 bg-white rounded-3xl shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  if (!tenantProfile) return null;

  return (
    <div className="col-start-2 col-end-12 space-y-8 py-8 bg-linear-to-br from-slate-50 via-blue-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-8 flex items-center gap-8 hover:shadow-md transition-shadow duration-300">
        <img
          src={tenantProfile.logoUrl}
          alt="Logo"
          className="w-28 h-28 rounded-2xl object-cover border-3 border-blue-100 shadow-sm"
        />

        <div className="flex-1">
          <h1 className="text-4xl font-bold  mb-1">
            {tenantProfile.nameTenant}
          </h1>
          <p className=" font-medium text-lg">Trang quản trị nhà hàng</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address */}
        <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-7 flex items-start gap-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
          <div className="p-4 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl text-blue-600 group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-300">
            <MapPin size={28} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-500 mb-2">Địa chỉ</p>
            <p className="font-semibold text-gray-800 text-base leading-relaxed">
              {tenantProfile.address}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-7 flex items-start gap-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
          <div className="p-4 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl text-blue-600 group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-300">
            <Phone size={28} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-500 mb-2">
              Số điện thoại
            </p>
            <p className="font-semibold text-gray-800 text-base">
              {tenantProfile.phone}
            </p>
          </div>
        </div>

        {/* Open hours */}
        <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-7 flex items-start gap-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
          <div className="p-4 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl text-blue-600 group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-300">
            <Clock size={28} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-500 mb-2">
              Giờ hoạt động
            </p>
            <p className="font-semibold text-gray-800 text-base">
              {tenantProfile.openHours.slice(0, 5)} –{" "}
              {tenantProfile.closeHours.slice(0, 5)}
            </p>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-500">
        <h2 className="text-3xl font-bold mb-3">👋 Chào mừng bạn quay lại!</h2>
        <p className="text-blue-100 text-lg leading-relaxed">
          Quản lý nhà hàng{" "}
          <strong className="text-white">{tenantProfile.nameTenant}</strong>{" "}
          hiệu quả hơn mỗi ngày.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
