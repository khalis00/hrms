import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import LeaveRequestDialog from "./LeaveRequestDialog";
import LeaveCalendar from "./LeaveCalendar";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    const fetchCurrentEmployee = async () => {
      // In a real app, this would come from your auth context
      // For now, we'll just get the first employee
      const { data } = await supabase
        .from("employees")
        .select("*")
        .limit(1)
        .single();

      setCurrentEmployee(data);
    };

    fetchCurrentEmployee();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(
          `
          *,
          employee:employees(full_name),
          approver:employees(full_name)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeaves(data || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      showToast.error("Error fetching leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();

    const subscription = supabase
      .channel("leave_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leave_requests" },
        fetchLeaves,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave Management</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Request Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Recent Leave Requests
            </h2>
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{leave.employee.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(leave.start_date).toLocaleDateString()} -{" "}
                      {new Date(leave.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(leave.status)}
                    >
                      {leave.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <LeaveCalendar
            leaves={leaves.map((l) => ({
              id: l.id,
              employee_name: l.employee.full_name,
              leave_type: l.leave_type,
              start_date: l.start_date,
              end_date: l.end_date,
              status: l.status,
            }))}
          />
        </div>
      </div>

      {currentEmployee && (
        <LeaveRequestDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={fetchLeaves}
          employeeId={currentEmployee.id}
        />
      )}
    </div>
  );
};

export default LeaveList;
