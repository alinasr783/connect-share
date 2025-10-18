import {Outlet} from "react-router-dom";
import Sidebar from "../../ui/Sidebar";

function AdminAppLayout() {
  const links = [
    {to: "clinics", label: "Clinics", icon: "ri-hospital-line"},
    {to: "users", label: "Users", icon: "ri-user-line"},
    {to: "bookings", label: "Bookings", icon: "ri-calendar-line"},
    {to: "financial-management", label: "Financials", icon: "ri-money-dollar-circle-line"},
  ];

  return (
    <div className="flex h-screen w-screen">
      <Sidebar links={links} />

      <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminAppLayout;