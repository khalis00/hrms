import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { departmentSchema, type DepartmentFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";

interface AddDepartmentDialogProps {
  department?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddDepartmentDialog = ({
  department,
  open,
  onOpenChange,
  onSuccess,
}: AddDepartmentDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: department || {
      name: "",
      description: "",
      icon: "",
    },
  });

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (department?.id) {
        const { error } = await supabase
          .from("departments")
          .update(data)
          .eq("id", department.id);

        if (error) throw error;
        showToast.success("Department updated successfully");
      } else {
        const { error } = await supabase.from("departments").insert({
          ...data,
          status: "active",
          employee_count: 0,
        });

        if (error) throw error;
        showToast.success("Department added successfully");
      }

      reset();
      onOpenChange?.(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving department:", error);
      showToast.error("Error saving department");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {department?.id ? "Edit Department" : "Add New Department"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Engineering"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Department description..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? department?.id
                  ? "Updating..."
                  : "Adding..."
                : department?.id
                  ? "Update Department"
                  : "Add Department"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentDialog;
