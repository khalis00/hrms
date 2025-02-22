import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import { AuthProvider } from "./lib/contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./components/auth/LoginPage";

// Lazy load components
const Home = lazy(() => import("./components/home"));
const LeaveList = lazy(() => import("./components/leave/LeaveList"));
const EmployeeList = lazy(() =>
  import("./components/employees/EmployeeList").then((module) => ({
    default: module.default,
  })),
);
const EmployeeDetails = lazy(() =>
  import("./components/employees/EmployeeDetails").then((module) => ({
    default: module.default,
  })),
);
const DepartmentList = lazy(() =>
  import("./components/departments/DepartmentList").then((module) => ({
    default: module.default,
  })),
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Suspense>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/leave" element={<LeaveList />} />

                    {/* Admin only routes */}
                    <Route
                      path="/employees"
                      element={
                        <ProtectedRoute requireAdmin>
                          <EmployeeList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/employees/:id"
                      element={
                        <ProtectedRoute requireAdmin>
                          <EmployeeDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/departments"
                      element={
                        <ProtectedRoute requireAdmin>
                          <DepartmentList />
                        </ProtectedRoute>
                      }
                    />

                    {/* Tempo routes */}
                    {import.meta.env.VITE_TEMPO === "true" && (
                      <Route path="/tempobook/*" />
                    )}
                  </Routes>
                </Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
