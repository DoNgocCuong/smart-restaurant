import { CheckCircle, Home, FileText } from "lucide-react";
import { useEffect, useState } from "react";

function PaymentSuccess() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-700 ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          {/* Icon thành công */}
          <div className="mb-6 flex justify-center">
            <div
              className={`relative transform transition-all duration-500 delay-200 ${animate ? "scale-100 rotate-0" : "scale-0 rotate-180"}`}
            >
              <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <CheckCircle
                className="relative w-24 h-24 text-green-500"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Thanh toán thành công!
          </h1>

          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã sử dụng MoMo. Giao dịch của bạn đã được xử lý thành
            công.
          </p>

          {/* Thông tin giao dịch */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <span className="text-gray-600">Mã giao dịch</span>
              <span className="font-semibold text-gray-800">
                #MO{Date.now().toString().slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <span className="text-gray-600">Thời gian</span>
              <span className="font-semibold text-gray-800">
                {new Date().toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trạng thái</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Thành công
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ{" "}
              <a href="#" className="text-purple-600 hover:underline">
                hỗ trợ khách hàng
              </a>
            </p>
          </div>
        </div>

        {/* Confetti effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${animate ? "animate-bounce" : "opacity-0"}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                backgroundColor: ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981"][
                  Math.floor(Math.random() * 4)
                ],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
