import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles = [] }) {
  const { isLoggedIn, role } = useContext(AuthContext);
  console.log("is loggin: " + isLoggedIn);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role))
    return <Navigate to="/unauthorized" replace />;

  return children;
}

export default RoleRoute;
