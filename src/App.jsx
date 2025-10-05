import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "react-hot-toast";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import useAuthListener from "./features/auth/useAuthListener";
import DoctorAppLayout from "./features/Dashboard/DoctorAppLayout";
import ProviderAppLayout from "./features/Dashboard/ProviderAppLayout";
import ProviderDashboard from "./features/providerDashboard/ProviderDashboard";
import Dashboard from "./pages/Dashboard";
import DoctorBookings from "./pages/DoctorBookings";
import DoctorFindClinics from "./pages/DoctorFindClinics";
import DoctorSupport from "./pages/DoctorSupport";
import FindClinic from "./pages/FindClinic";
import Login from "./pages/Login";
import ProviderClinics from "./pages/ProviderClinics";
import ProviderPayments from "./pages/ProviderPayments";
import ProviderRentals from "./pages/ProviderRentals";
import {default as ProviderSettings} from "./pages/ProviderSettings";
import Signup from "./pages/Signup";
import Home from "./ui/Home/Home";
import NotFound from "./ui/NotFound";
import ProtectedRoutes from "./ui/ProtectedRoutes";
import RoleProtectedRoute from "./ui/RoleProtectedRoute";

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
            <Route path="payments" element={<ProviderPayments />} />
            <Route path="settings" element={<ProviderSettings />} />
            <Route path="support" element={<DoctorSupport />} />
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
