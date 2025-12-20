import { Outlet } from "react-router";

function GuestLayout() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-12">
        <div className="col-span-12 ">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default GuestLayout;
