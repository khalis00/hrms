import React, { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import DepartmentCard from "./DepartmentCard";
import AddDepartmentDialog from "./AddDepartmentDialog";
import DepartmentGridSkeleton from "../skeletons/DepartmentGridSkeleton";

interface DepartmentGridProps {
  searchQuery?: string;
  statusFilter?: string;
}

const DepartmentGrid = ({
  searchQuery = "",
  statusFilter = "all",
}: DepartmentGridProps) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDepartment, setEditDepartment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const fetchDepartments = async () => {
    try {
      let query = supabase.from("departments").select("*").order("name");

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      showToast.error("Error fetching departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();

    const subscription = supabase
      .channel("departments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "departments" },
        () => fetchDepartments(),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [searchQuery, statusFilter]);

  const handleStatusChange = async (
    departmentId: string,
    newStatus: string,
  ) => {
    try {
      const { error } = await supabase
        .from("departments")
        .update({ status: newStatus })
        .eq("id", departmentId);

      if (error) throw error;
      showToast.success("Department status updated");
    } catch (error) {
      console.error("Error updating department status:", error);
      showToast.error("Error updating department status");
    }
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;

    try {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", departmentToDelete.id);

      if (error) throw error;
      showToast.success("Department deleted successfully");
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (error) {
      console.error("Error deleting department:", error);
      showToast.error("Error deleting department");
    }
  };

  if (loading) {
    return <DepartmentGridSkeleton />;
  }

  return (
    <>
      <AddDepartmentDialog
        department={editDepartment}
        open={!!editDepartment}
        onOpenChange={(open) => !open && setEditDepartment(null)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {departmentToDelete?.name}{" "}
              department. This action cannot be undone.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            {...department}
            onEdit={() => setEditDepartment(department)}
            onDelete={() => {
              setDepartmentToDelete(department);
              setDeleteDialogOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </>
  );
};

export default DepartmentGrid;
