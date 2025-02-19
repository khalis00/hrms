import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Toaster } from "../ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { employeeSchema, type EmployeeFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/utils/toast";
import { Upload, X } from "lucide-react";

interface AddEmployeeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddEmployeeDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: AddEmployeeDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      salary: 0,
      documents: [],
    },
  });

  const documents = watch("documents") || [];

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      const newDocs = Array.from(files).map((file) => ({
        name: file.name,
        file,
      }));

      setValue("documents", [...documents, ...newDocs]);
    },
    [documents, setValue],
  );

  const removeDocument = useCallback(
    (index: number) => {
      const newDocs = [...documents];
      newDocs.splice(index, 1);
      setValue("documents", newDocs);
    },
    [documents, setValue],
  );

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // First insert the employee
      const { data: employee, error: employeeError } = await supabase
        .from("employees")
        .insert({
          full_name: data.full_name,
          email: data.email,
          department: data.department,
          position: data.position,
          start_date: data.start_date,
          salary: data.salary,
          phone: data.phone,
          address: data.address,
          emergency_contact: data.emergency_contact,
        })
        .select()
        .single();

      if (employeeError) throw employeeError;

      // Then upload documents if any
      if (data.documents?.length) {
        for (const doc of data.documents) {
          const fileExt = doc.name.split(".").pop();
          const filePath = `${employee.id}/${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("employee_documents")
            .upload(filePath, doc.file);

          if (uploadError) throw uploadError;

          // Add document record
          const { error: docError } = await supabase
            .from("employee_documents")
            .insert({
              employee_id: employee.id,
              name: doc.name,
              file_url: filePath,
              file_type: fileExt,
            });

          if (docError) throw docError;
        }
      }

      showToast.success("Employee added successfully");
      reset();
      onOpenChange?.(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error adding employee:", error);
      showToast.error("Error adding employee");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="John Doe"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={(value) => setValue("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Software Engineer"
                {...register("position")}
              />
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" type="date" {...register("start_date")} />
              {errors.start_date && (
                <p className="text-sm text-red-500">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                type="number"
                {...register("salary", { valueAsNumber: true })}
              />
              {errors.salary && (
                <p className="text-sm text-red-500">{errors.salary.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 234 567 8900"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter address"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                placeholder="Name and contact number"
                {...register("emergency_contact")}
              />
              {errors.emergency_contact && (
                <p className="text-sm text-red-500">
                  {errors.emergency_contact.message}
                </p>
              )}
            </div>

            <div className="grid gap-2 col-span-2">
              <Label>Documents</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button type="button" size="icon" variant="outline">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>

                {documents.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm truncate">{doc.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

export default AddEmployeeDialog;
