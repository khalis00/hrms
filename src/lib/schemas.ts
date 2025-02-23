import * as z from "zod";

export const employeeSchema = z.object({
  status: z.enum(["active", "inactive", "on_leave"]).default("active"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Please select a department"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  start_date: z.string().min(1, "Start date is required"),
  salary: z.number().min(0, "Salary must be a positive number"),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  profile_picture: z.instanceof(File).optional(),
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

export const leaveRequestSchema = z.object({
  employee_id: z.string().uuid(),
  leave_type: z.enum([
    "vacation",
    "sick",
    "personal",
    "maternity",
    "paternity",
    "bereavement",
  ]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  reason: z.string().min(10, "Please provide a detailed reason"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type DepartmentFormData = z.infer<typeof departmentSchema>;
export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;
