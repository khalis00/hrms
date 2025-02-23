import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Phone, MapPin, User } from "lucide-react";
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Section */}
        <Card className="p-6 md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src={
                  employee.profile_picture_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`
                }
                alt={employee.full_name}
              />
              <AvatarFallback>
                {employee.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{employee.full_name}</h2>
            <p className="text-gray-500 mb-4">{employee.position}</p>
            <Badge
              variant="secondary"
              className={employee.status === "inactive" ? "bg-gray-100" : ""}
            >
              {employee.status || "Active"}
            </Badge>

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{employee.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{employee.address || "N/A"}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div>
                <label className="text-sm text-gray-500">Employee ID</label>
                <p>{employee.id}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p>{employee.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p>{employee.phone || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p>{employee.address || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  Emergency Contact
                </label>
                <p>{employee.emergency_contact || "N/A"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Employment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <p>{employee.status || "Active"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Salary</label>
                <p>KES {employee.salary?.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
