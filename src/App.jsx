import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import useAuthListener from "./features/auth/useAuthListener";
import Home from "./ui/Home/Home";
import NotFound from "./ui/NotFound";
import ProtectedRoutes from "./ui/ProtectedRoutes";
import RoleProtectedRoute from "./ui/RoleProtectedRoute";
import Spinner from "./ui/Spinner";

// Lazy load all non-critical components
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

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
      <Suspense fallback={<Spinner />}>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </Suspense>
      <AuthWrapper />
    </QueryClientProvider>
  );
}

function AuthWrapper() {
  useAuthListener(); // Listen for auth state changes

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
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
              <Route path="rentals" element={<ProviderRentals />} />
              <Route path="payments" element={<ProviderPayments />} />
              <Route path="settings" element={<ProviderSettings />} />
            </Route>
          </Route>

          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

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
            backgroundColor: "var(--color-success)",
            color: "var(--color-dark)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
