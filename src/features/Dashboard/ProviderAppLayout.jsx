import {Outlet} from "react-router-dom";
import Sidebar from "../../ui/Sidebar";

function ProviderAppLayout() {
  const links = [
    {to: "dashboard", label: "Dashboard", icon: "ri-dashboard-line"},
    {to: "clinics", label: "Clinics", icon: "ri-hospital-line"},
    {to: "rentals", label: "Rentals", icon: "ri-building-line"},
    {to: "payments", label: "User Payments", icon: "ri-bank-card-line"},
    {to: "settings", label: "Settings", icon: "ri-settings-line"},
  ];

  return (
    <div className="flex h-screen w-screen">
      <Sidebar links={links} />

      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default ProviderAppLayout;
