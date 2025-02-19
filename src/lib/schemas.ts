import * as z from "zod";

export const employeeSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Please select a department"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  start_date: z.string().min(1, "Start date is required"),
  salary: z.number().min(0, "Salary must be a positive number"),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        file: z.instanceof(File),
      }),
    )
    .optional(),
});

export const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type DepartmentFormData = z.infer<typeof departmentSchema>;
