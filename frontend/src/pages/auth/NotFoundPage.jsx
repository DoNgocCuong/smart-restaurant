import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-7xl font-extrabold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>

      <div className="flex gap-4">
        {/* Nút quay về */}
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          ← Quay về
        </button>

        {/* Nút đăng nhập */}
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          🔐 Đăng nhập
        </button>
      </div>
    </div>
  );
}
