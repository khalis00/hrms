import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import EmployeeDetailsSkeleton from "../skeletons/EmployeeDetailsSkeleton";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return <EmployeeDetailsSkeleton />;
  }

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{employee.full_name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p>{employee.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Department</label>
              <p>{employee.department}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Position</label>
              <p>{employee.position}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Start Date</label>
              <p>{new Date(employee.start_date).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p>{employee.phone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <p>{employee.address || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Emergency Contact</label>
              <p>{employee.emergency_contact || "N/A"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Employment Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Employee ID</label>
              <p>{employee.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Salary</label>
              <p>${employee.salary?.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <p>{employee.status || "Active"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDetails;
