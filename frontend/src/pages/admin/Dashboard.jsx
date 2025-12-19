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
      <div className="p-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!tenantProfile) return null;

  return (
    <div className="col-start-2 col-end-12 space-y-6 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
        <img
          src={tenantProfile.logoUrl}
          alt="Logo"
          className="w-24 h-24 rounded-xl object-cover border"
        />

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {tenantProfile.nameTenant}
          </h1>
          <p className="text-gray-500">Trang quản trị nhà hàng</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address */}
        <div className="bg-white rounded-2xl shadow p-5 flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Địa chỉ</p>
            <p className="font-medium text-gray-800">{tenantProfile.address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-white rounded-2xl shadow p-5 flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-xl text-green-600">
            <Phone size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Số điện thoại</p>
            <p className="font-medium text-gray-800">{tenantProfile.phone}</p>
          </div>
        </div>

        {/* Open hours */}
        <div className="bg-white rounded-2xl shadow p-5 flex items-start gap-4">
          <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Giờ hoạt động</p>
            <p className="font-medium text-gray-800">
              {tenantProfile.openHours.slice(0, 5)} –{" "}
              {tenantProfile.closeHours.slice(0, 5)}
            </p>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">
          👋 Chào mừng bạn quay lại!
        </h2>
        <p className="opacity-90">
          Quản lý nhà hàng <strong>{tenantProfile.nameTenant}</strong> hiệu quả
          hơn mỗi ngày.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
