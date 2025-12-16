import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles = [] }) {
  const { isLoggedIn, role } = useContext(AuthContext);

  // 1. Chưa đăng nhập
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. Không truyền allowedRoles → coi như cấm
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    console.error("RoleRoute: allowedRoles is missing or invalid");
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Sai role
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. OK
  return children;
}

export default RoleRoute;
