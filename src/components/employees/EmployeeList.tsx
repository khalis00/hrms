import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import EmployeeTable from "./EmployeeTable";
import EmployeeFilters from "./EmployeeFilters";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employees</h1>
      </div>

      <Card className="p-6">
        <EmployeeFilters
          onSearchChange={setSearchQuery}
          onDepartmentChange={setDepartmentFilter}
          onStatusChange={setStatusFilter}
          onRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
        <EmployeeTable
          key={refreshKey}
          onRowClick={(id) => navigate(`/employees/${id}`)}
          searchQuery={searchQuery}
          departmentFilter={departmentFilter}
          statusFilter={statusFilter}
        />
      </Card>
    </div>
  );
};

export default EmployeeList;
