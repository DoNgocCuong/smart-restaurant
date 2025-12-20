import Navigation from "../common/Navigation";
import { Outlet } from "react-router";
function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <Navigation />

      <main className="grid grid-cols-12 gap-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
