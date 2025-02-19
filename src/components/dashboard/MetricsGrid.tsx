import React from "react";
import MetricCard from "./MetricCard";
import { Users, Briefcase, Building2, DollarSign } from "lucide-react";

interface MetricsGridProps {
  metrics?: {
    employees: { total: number; change: number };
    positions: { total: number; change: number };
    departments: { total: number; change: number };
    payroll: { total: number; change: number };
  };
}

const defaultMetrics = {
  employees: { total: 250, change: 5 },
  positions: { total: 15, change: -2 },
  departments: { total: 8, change: 0 },
  payroll: { total: 450000, change: 3 },
};

const MetricsGrid = ({ metrics = defaultMetrics }: MetricsGridProps) => {
  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
        <MetricCard
          title="Total Employees"
          value={metrics.employees.total}
          change={metrics.employees.change}
          color="blue"
          icon={<Users />}
        />

        <MetricCard
          title="Open Positions"
          value={metrics.positions.total}
          change={metrics.positions.change}
          color="purple"
          icon={<Briefcase />}
        />

        <MetricCard
          title="Departments"
          value={metrics.departments.total}
          change={metrics.departments.change}
          color="orange"
          icon={<Building2 />}
        />

        <MetricCard
          title="Monthly Payroll"
          value={`$${metrics.payroll.total.toLocaleString()}`}
          change={metrics.payroll.change}
          color="green"
          icon={<DollarSign />}
        />
      </div>
    </div>
  );
};

export default MetricsGrid;
