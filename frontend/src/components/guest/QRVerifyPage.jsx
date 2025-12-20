import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import qrApi from "../api/qrApi";
import toast from "react-hot-toast";

export default function QRVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("t");

  useEffect(() => {
    if (!token) return;

    qrApi
      .verifyToken(token)
      .then((res) => {
        // ✅ Giả sử backend trả về tenantId & tableId
        navigate(`/menu/${res.data.tenantId}/tables/${res.data.tableId}`);
      })
      .catch(() => toast.error("Mã QR không hợp lệ hoặc đã hết hạn"));
  }, [token]);

  return <div>Đang xác minh mã QR...</div>;
}
