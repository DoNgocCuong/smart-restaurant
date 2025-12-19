import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";

import NotFoundPage from "../pages/auth/NotFoundPage";
import Unauthorized from "../pages/auth/Unauthorized";
import RoleRoute from "./RoleRoute";

import SuperAdminLayout from "../components/layout/SuperAdminLayout";
import AdminLayout from "../components/layout/AdminLayout";

import AccountManagement from "../pages/super-admin/AccountManagement";

import Dashboard from "../pages/admin/Dashboard";
import TableManagement from "../pages/admin/TableManagement";
import RegisterInforTenant from "../pages/admin/RegisterInforTenant";

import GuestLayout from "../components/layout/GuestLayout";
import Menu from "../pages/guest/Menu";
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

      {/* Tenant Admin */}
      <Route
        path="/tenant-admin"
        element={
          <RoleRoute allowedRoles={["TENANT_ADMIN"]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="table-management" element={<TableManagement />} />
        <Route path="tenant-create" element={<RegisterInforTenant />} />
      </Route>

      {/* Guest */}
      <Route path="/guest" element={<GuestLayout />}>
        <Route path="menu" element={<Menu />} />
      </Route>

      {/* 404 - Route không tồn tại */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
