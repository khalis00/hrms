import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import DepartmentGrid from "./DepartmentGrid";
import DepartmentFilters from "./DepartmentFilters";

const DepartmentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-none p-6 pb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Departments</h1>
        </div>
      </div>

      <div className="flex-1 p-6 pt-0 overflow-auto">
        <Card className="p-6">
          <DepartmentFilters
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onRefresh={() => setRefreshKey((prev) => prev + 1)}
          />
          <DepartmentGrid
            key={refreshKey}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        </Card>
      </div>
    </div>
  );
};

export default DepartmentList;
