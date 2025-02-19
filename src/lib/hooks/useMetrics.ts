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
          .select("salary")
          .eq("status", "active");

        // Get total departments
        const { data: departments } = await supabase
          .from("departments")
          .select("id")
          .eq("status", "active");

        // Calculate metrics
        const totalEmployees = employees?.length || 0;
        const totalPayroll =
          employees?.reduce((sum, emp) => sum + (emp.salary || 0), 0) || 0;
        const totalDepartments = departments?.length || 0;

        setMetrics({
          employees: { total: totalEmployees, change: 5 }, // Change % would need historical data
          positions: { total: 15, change: -2 }, // This would come from a positions table
          departments: { total: totalDepartments, change: 0 },
          payroll: { total: totalPayroll, change: 3 },
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
