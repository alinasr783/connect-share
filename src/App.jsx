import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "react-hot-toast";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import useAuthListener from "./features/auth/useAuthListener";
import AdminAppLayout from "./features/Dashboard/AdminAppLayout";
import DoctorAppLayout from "./features/Dashboard/DoctorAppLayout";
import ProviderAppLayout from "./features/Dashboard/ProviderAppLayout";
import AdminBookingDetails from "./pages/AdminBookingDetails";
import AdminBookings from "./pages/AdminBookings";
import AdminClinicDetails from "./pages/AdminClinicDetails";
import AdminClinics from "./pages/AdminClinics";
import AdminUsers from "./pages/AdminUsers";
import Dashboard from "./pages/Dashboard";
import DoctorBookings from "./pages/DoctorBookings";
import DoctorFindClinics from "./pages/DoctorFindClinics";
import DoctorPayments from "./pages/DoctorPayments";
import DoctorSupport from "./pages/DoctorSupport";
import FindClinic from "./pages/FindClinic";
import Login from "./pages/Login";
import ProviderClinics from "./pages/ProviderClinics";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderPayments from "./pages/ProviderPayments";
import ProviderRentals from "./pages/ProviderRentals";
import Settings, {default as ProviderSettings} from "./pages/Settings";
import Signup from "./pages/Signup";
import Home from "./ui/Home/Home";
import NotFound from "./ui/NotFound";
import ProtectedRoutes from "./ui/ProtectedRoutes";
import RoleProtectedRoute from "./ui/RoleProtectedRoute";
import AdminDoctorDetails from "./pages/AdminDoctorDetails";

import UserManagement from "./pages/UserManagement";
import BookingManagment from "./pages/BookingManagement";
import UserProfile from "./pages/UserProfile";

import FinancialManagement from "./pages/FinancialManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <AuthWrapper />
    </QueryClientProvider>
  );
}

function AuthWrapper() {
  useAuthListener(); // Listen for auth state changes

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="provider"
            element={
              <RoleProtectedRoute role="provider">
                <ProviderAppLayout />
              </RoleProtectedRoute>
            }>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="clinics" element={<ProviderClinics />} />
            <Route path="rentals" element={<ProviderRentals />} />
            <Route path="payments" element={<ProviderPayments />} />
            <Route path="settings" element={<ProviderSettings />} />
          </Route>

          <Route
            path="doctor"
            element={
              <RoleProtectedRoute role="doctor">
                <DoctorAppLayout />
              </RoleProtectedRoute>
            }>
            <Route index element={<Navigate to="clinics" />} />
            <Route path="clinics" element={<DoctorFindClinics />} />
            <Route path="clinics/:id" element={<FindClinic />} />
            <Route path="bookings" element={<DoctorBookings />} />
            <Route path="payments" element={<DoctorPayments />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<DoctorSupport />} />
          </Route>

          <Route
            path="admin"
            element={
              <RoleProtectedRoute role="admin">
                <AdminAppLayout />
              </RoleProtectedRoute>
            }>
            <Route index element={<Navigate to="bookings" />} />
            <Route path="clinics" element={<AdminClinics />} />
            <Route path="clinics/:id" element={<AdminClinicDetails />} />
            <Route path="users"  element={<UserManagement />} />
            <Route path="doctors/:userId" element={<AdminDoctorDetails />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="bookings" element={<BookingManagment />} />
            <Route path="bookings/:id" element={<AdminBookingDetails />} />
            <Route path="booking-management" element={<BookingManagment />} />
            <Route path="users/:id" element={<UserProfile/>} />
            <Route path="financial-management" element={<FinancialManagement />} />
          </Route>
        </Route>

        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{margin: "8px"}}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "var(--color-gray-50)",
            color: "var(--color-dark)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
