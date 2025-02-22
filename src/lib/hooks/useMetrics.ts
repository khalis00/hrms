import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Metrics {
  employees: { total: number; change: number };
  positions: { total: number; change: number };
  departments: { total: number; change: number };
  payroll: { total: number; change: number };
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    employees: { total: 0, change: 0 },
    positions: { total: 0, change: 0 },
    departments: { total: 0, change: 0 },
    payroll: { total: 0, change: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get total employees and total payroll
        const { data: employees } = await supabase
          .from("employees")
          .select("salary");

        // Get total departments
        const { data: departments } = await supabase
          .from("departments")
          .select("id")
          .eq("status", "active");

        // Get last month's data for comparison
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const { data: lastMonthEmployees } = await supabase
          .from("employees")
          .select("salary")
          .lt("created_at", lastMonth.toISOString());

        const { data: lastMonthDepartments } = await supabase
          .from("departments")
          .select("id")
          .eq("status", "active")
          .lt("created_at", lastMonth.toISOString());

        // Calculate current metrics
        const totalEmployees = employees?.length || 0;
        const totalPayroll =
          employees?.reduce((sum, emp) => sum + (emp.salary || 0), 0) || 0;
        const totalDepartments = departments?.length || 0;

        // Calculate last month's metrics
        const lastMonthTotalEmployees =
          lastMonthEmployees?.length || totalEmployees;
        const lastMonthTotalDepartments =
          lastMonthDepartments?.length || totalDepartments;
        const lastMonthTotalPayroll =
          lastMonthEmployees?.reduce(
            (sum, emp) => sum + (emp.salary || 0),
            0,
          ) || totalPayroll;

        // Calculate percentage changes
        const employeeChange = lastMonthTotalEmployees
          ? Math.round(
              ((totalEmployees - lastMonthTotalEmployees) /
                lastMonthTotalEmployees) *
                100,
            )
          : 0;
        const departmentChange = lastMonthTotalDepartments
          ? Math.round(
              ((totalDepartments - lastMonthTotalDepartments) /
                lastMonthTotalDepartments) *
                100,
            )
          : 0;
        const payrollChange = lastMonthTotalPayroll
          ? Math.round(
              ((totalPayroll - lastMonthTotalPayroll) / lastMonthTotalPayroll) *
                100,
            )
          : 0;

        setMetrics({
          employees: { total: totalEmployees, change: employeeChange },
          positions: {
            total: totalEmployees > 0 ? Math.ceil(totalEmployees * 0.1) : 0, // Estimate open positions as 10% of total employees
            change: 0,
          },
          departments: { total: totalDepartments, change: departmentChange },
          payroll: { total: totalPayroll, change: payrollChange },
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Subscribe to changes
    const employeesSubscription = supabase
      .channel("employees-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        fetchMetrics,
      )
      .subscribe();

    const departmentsSubscription = supabase
      .channel("departments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "departments" },
        fetchMetrics,
      )
      .subscribe();

    return () => {
      employeesSubscription.unsubscribe();
      departmentsSubscription.unsubscribe();
    };
  }, []);

  return { metrics, loading };
};
