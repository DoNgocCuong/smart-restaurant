import { AlertCircle, Home, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QrError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="text-red-500" size={52} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Xác thực QR thất bại
        </h1>

        <p className="text-gray-600 mb-6">
          Mã QR không hợp lệ hoặc đã hết hạn.
          <br />
          Vui lòng liên hệ nhà hàng để được cấp QR mới nhất
        </p>
      </div>
    </div>
  );
}
