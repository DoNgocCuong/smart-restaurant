import { Outlet } from "react-router";

function SuperAdminLayout() {
  return (
    <div className="grid grid-cols-12 min-h-screen">
      <Outlet />
    </div>
  );
}

export default SuperAdminLayout;
