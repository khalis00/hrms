import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import routes from "tempo-routes";

// Lazy load components
const Home = lazy(() => import("./components/home"));
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
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Suspense>
    </DashboardLayout>
  );
}

export default App;
