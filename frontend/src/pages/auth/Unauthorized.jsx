import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          403 - Unauthorized
        </h1>

        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập vào trang này.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Quay lại
          </button>

          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
