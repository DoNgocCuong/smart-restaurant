import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";

import Unauthorized from "../pages/auth/Unauthorized";
import RoleRoute from "./RoleRoute";

import SuperAdminLayout from "../components/layout/SuperAdminLayout";

import AccountManagement from "../pages/super-admin/AccountManagement";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />}></Route>

      {/* Super Admin */}
      <Route
        path="/super-admin"
        element={
          <RoleRoute allowedRoles={["SUPER_ADMIN"]}>
            {/* <RoleRoute> */}
            <SuperAdminLayout />
          </RoleRoute>
        }
      >
        <Route path="accounts" element={<AccountManagement />} />
      </Route>
    </Routes>
  );
}
