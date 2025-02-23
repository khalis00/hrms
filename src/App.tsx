import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";

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
    <DashboardLayout>
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/leave" element={<LeaveList />} />
          {/* Add this before the catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}

export default App;
