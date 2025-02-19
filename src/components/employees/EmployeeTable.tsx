import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import EmployeeTableSkeleton from "../skeletons/EmployeeTableSkeleton";

interface EmployeeTableProps {
  onRowClick?: (id: string) => void;
  searchQuery?: string;
  departmentFilter?: string;
  statusFilter?: string;
}

const EmployeeTable = ({
  onRowClick,
  searchQuery = "",
  departmentFilter = "all",
  statusFilter = "all",
}: EmployeeTableProps) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = async () => {
    try {
      let query = supabase.from("employees").select("*").order("full_name");

      if (searchQuery) {
        query = query.ilike("full_name", `%${searchQuery}%`);
      }

      if (departmentFilter !== "all") {
        query = query.eq("department", departmentFilter);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showToast.error("Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();

    const subscription = supabase
      .channel("employees")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        () => fetchEmployees(),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [searchQuery, departmentFilter, statusFilter]);

  const handleStatusChange = async (employeeId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("employees")
        .update({ status: newStatus })
        .eq("id", employeeId);

      if (error) throw error;
      showToast.success("Employee status updated");
    } catch (error) {
      console.error("Error updating employee status:", error);
      showToast.error("Error updating employee status");
    }
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", employeeToDelete.id);

      if (error) throw error;
      showToast.success("Employee deleted successfully");
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      showToast.error("Error deleting employee");
    }
  };

  if (loading) {
    return <EmployeeTableSkeleton />;
  }

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {employeeToDelete?.full_name}'s
              record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell
                onClick={() => onRowClick?.(employee.id)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`}
                      alt={employee.full_name}
                    />
                    <AvatarFallback>
                      {employee.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.full_name}</p>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell
                onClick={() => onRowClick?.(employee.id)}
                className="cursor-pointer"
              >
                {employee.department}
              </TableCell>
              <TableCell
                onClick={() => onRowClick?.(employee.id)}
                className="cursor-pointer"
              >
                {employee.position}
              </TableCell>
              <TableCell
                onClick={() => onRowClick?.(employee.id)}
                className="cursor-pointer"
              >
                {new Date(employee.start_date).toLocaleDateString()}
              </TableCell>
              <TableCell
                onClick={() => onRowClick?.(employee.id)}
                className="cursor-pointer"
              >
                <Badge
                  variant="secondary"
                  className={
                    employee.status === "inactive" ? "bg-gray-100" : ""
                  }
                >
                  {employee.status || "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(employee.id, "active")}
                    >
                      Set as Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(employee.id, "inactive")
                      }
                    >
                      Set as Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusChange(employee.id, "on_leave")
                      }
                    >
                      Set as On Leave
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setEmployeeToDelete(employee);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default EmployeeTable;
