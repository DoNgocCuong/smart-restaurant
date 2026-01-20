import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VerifiedEmail() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Icon Section */}
          <div className="bg-linear-to-r from-green-400 to-blue-500 px-6 py-12 flex justify-center">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Xác thực email thành công
            </h1>
            <p className="text-gray-600 mb-2">Email của bạn đã được xác minh</p>
            <p className="text-sm text-gray-500 mb-8">
              Bây giờ bạn có thể đăng nhập và bắt đầu sử dụng tài khoản
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Quay lại menu sau khi quét mã QR để đăng nhập và đặt món nhanh
              chóng
            </p>
            {/* Success Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-8">
              <p className="text-green-700 font-semibold text-sm">
                ✓ Tài khoản của bạn đã sẵn sàng
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Nếu có vấn đề, vui lòng{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline font-semibold"
              >
                liên hệ support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifiedEmail;
