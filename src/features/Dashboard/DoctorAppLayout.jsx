import {Outlet} from "react-router-dom";
import Sidebar from "../../ui/Provider/Sidebar";

function DoctorAppLayout() {
  const links = [
    {to: "clinics", label: "Find a Clinic", icon: "ri-hospital-line"},
    {to: "bookings", label: "My Bookings", icon: "ri-calendar-line"},
    {to: "payments", label: "Payments", icon: "ri-bank-card-line"},
    {to: "settings", label: "Profile Settings", icon: "ri-settings-line"},
    {to: "support", label: "Help & Support", icon: "ri-question-line"},
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

export default DoctorAppLayout;
