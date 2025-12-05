import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
// import NotFoundPage from "../pages/auth/NotFoundPage";

// import adminRoutes from "./roles/adminRoutes";
// import managerRoutes from "./roles/managerRoutes";
// import employeeRoutes from "./roles/employeeRoutes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}
