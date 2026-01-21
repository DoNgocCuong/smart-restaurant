import { X, Mail, Lock } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import Overlay from "../common/Overlay";
import CustomerInfoModal from "./CustomerInfoModal";

export default function LoginModal({
  onClose,
  tenantId,
  onSuccess,
  onRegisterModal,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);

  // Load Google Sign-In script
  useEffect(() => {
    // Kiểm tra nếu script đã được load
    if (document.getElementById("google-signin-script")) {
      initializeGoogleSignIn();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-signin-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      // Cleanup nếu cần
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "315292685589-c003buqq43ad0a35laoq80kelu45i6bf.apps.googleusercontent.com",
        // deploy 955403983411-1bp707jbei53tthatuk0863enivvu5f3.apps.googleusercontent.com
        callback: handleGoogleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        },
      );
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      setError("");

      const googleToken = response.credential;

      console.log("Google Token:", googleToken);

      // Gửi token lên backend
      const res = await authApi.loginWithGoogle(tenantId, {
        token: googleToken,
      });

      const accessToken = res?.result?.acessToken;
      const firstActivity = res?.result?.firstActivity;

      if (!accessToken) {
        throw new Error("Đăng nhập Google thất bại");
      }

      // Decode token để lấy email
      const payload = JSON.parse(atob(googleToken.split(".")[1]));
      const userName = payload.email;

      // 🔐 LƯU GIỐNG LOGIN PAGE
      localStorage.setItem("token", accessToken);
      sessionStorage.setItem("userName", userName);

      // 🔄 CẬP NHẬT AUTH CONTEXT
      await login(accessToken);

      if (firstActivity) {
        setShowCustomerInfo(true);
        return;
      }

      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng nhập Google thất bại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }
    try {
      setLoading(true);
      const res = await authApi.login({
        userName: email,
        password,
      });
      const accessToken = res?.result?.acessToken;
      const firstActivity = res?.result?.firstActivity;

      const userName = email;
      if (!accessToken) {
        throw new Error("Đăng nhập thất bại");
      }
      // 🔐 LƯU GIỐNG LOGIN PAGE
      localStorage.setItem("token", accessToken);
      sessionStorage.setItem("userName", userName);
      // 🔄 CẬP NHẬT AUTH CONTEXT
      await login(accessToken);

      if (firstActivity) {
        setShowCustomerInfo(true);
        return;
      }

      onClose();
      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Email hoặc mật khẩu không chính xác",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      {/* MODAL */}
      <div className="p-6 w-[92%] max-w-md bg-white rounded-3xl shadow-xl animate-scaleIn sm:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Đăng nhập
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 px-4 py-3 text-red-600 text-sm bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        {/* GOOGLE SIGN IN BUTTON */}
        <div className="mb-4">
          <div
            id="googleSignInButton"
            className="w-full flex justify-center"
          ></div>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">hoặc</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 text-gray-400 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 pr-4 py-3 w-full border-gray-200 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-black/80"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 text-gray-400 -translate-y-1/2"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-4 py-3 w-full border-gray-200 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-black/80"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="py-3 w-full text-white font-semibold bg-blue-600 rounded-2xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => {
              onRegisterModal();
            }}
            className="text-green-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
      {showCustomerInfo && (
        <CustomerInfoModal
          onClose={() => {
            setShowCustomerInfo(false);
            onClose();
          }}
          onSuccess={() => {
            onSuccess?.();
            setShowCustomerInfo(false);
          }}
        />
      )}
    </Overlay>
  );
}
