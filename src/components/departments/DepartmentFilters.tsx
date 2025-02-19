import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import AddDepartmentDialog from "./AddDepartmentDialog";

interface DepartmentFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
}

const DepartmentFilters = ({
  onSearchChange,
  onStatusChange,
  onRefresh,
}: DepartmentFiltersProps) => {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  return (
    <>
      <AddDepartmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={onRefresh}
      />
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search departments..."
              className="pl-9"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>
    </>
  );
};

export default DepartmentFilters;
